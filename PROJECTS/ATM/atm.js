// Matte ATM Machine Logic

document.addEventListener('DOMContentLoaded', function() {
  // DOM references
  const screen = document.getElementById('atm-screen-content');
  const keypad = document.getElementById('atm-keypad');

  // ATM state
  let state = 'welcome';
  let pin = '';
  let pinTries = 0;
  let cardBlocked = false;
  let userPin = '1234'; // Only set here, not in resetATM
  let balance = 1000;
  let history = [];
  let inputBuffer = '';
  let inputType = null; // 'pin', 'amount', 'account', etc.
  let transferAccount = '';

  // Utility
  function clearKeypad() { keypad.innerHTML = ''; }
  function renderKeypad(type, onInput, onEnter, onCancel) {
    clearKeypad();
    let keys = ['1','2','3','4','5','6','7','8','9','C','0','OK'];
    keys.forEach(key => {
      const btn = document.createElement('button');
      btn.className = 'atm-key';
      btn.textContent = key;
      if (key === 'OK') btn.style.background = '#1e90d6', btn.style.color = '#fff';
      if (key === 'C') btn.style.background = '#d32f2f', btn.style.color = '#fff';
      btn.onclick = () => {
        if (key === 'OK') onEnter();
        else if (key === 'C') onCancel();
        else onInput(key);
      };
      keypad.appendChild(btn);
    });
  }
  function showMessage(msg, color = '#d32f2f') {
    let el = document.getElementById('atm-message');
    if (!el) {
      el = document.createElement('div');
      el.className = 'atm-message';
      el.id = 'atm-message';
      screen.appendChild(el);
    }
    el.textContent = msg;
    el.style.color = color;
  }
  function clearMessage() {
    let el = document.getElementById('atm-message');
    if (el) el.textContent = '';
  }
  function resetATM() {
    state = 'welcome';
    pin = '';
    pinTries = 0;
    cardBlocked = false;
    balance = 1000;
    history = [];
    inputBuffer = '';
    inputType = null;
    transferAccount = '';
    renderWelcome();
  }

  // Screens
  function renderWelcome() {
    state = 'welcome';
    screen.innerHTML = `
      <h2 style="color:#232b3e;font-weight:700;margin-bottom:16px;">Welcome to ATM</h2>
      <p style="color:#3a4a5d;font-size:1.1rem;margin-bottom:32px;">Insert your card to begin</p>
      <button class="atm-btn" id="start-btn">Start</button>
    `;
    clearKeypad();
    document.getElementById('start-btn').onclick = renderPinEntry;
  }

  function renderPinEntry() {
    state = 'pin';
    pin = '';
    inputBuffer = '';
    inputType = 'pin';
    screen.innerHTML = `
      <h2 style="color:#232b3e;font-weight:700;margin-bottom:16px;">Enter PIN</h2>
      <div id="pin-dots" style="display:flex;gap:12px;justify-content:center;margin-bottom:18px;">
        <span class="pin-dot">${pin[0] ? '•' : ''}</span>
        <span class="pin-dot">${pin[1] ? '•' : ''}</span>
        <span class="pin-dot">${pin[2] ? '•' : ''}</span>
        <span class="pin-dot">${pin[3] ? '•' : ''}</span>
      </div>
    `;
    clearMessage();
    renderKeypad('pin',
      (digit) => {
        if (pin.length < 4) {
          pin += digit;
          updatePinDots();
        }
      },
      () => {
        if (pin.length === 4) checkPin();
      },
      () => {
        pin = pin.slice(0, -1);
        updatePinDots();
      }
    );
  }
  function updatePinDots() {
    const dots = screen.querySelectorAll('.pin-dot');
    for (let i = 0; i < 4; i++) {
      dots[i].textContent = pin[i] ? '•' : '';
    }
  }
  function checkPin() {
    if (cardBlocked) return;
    if (pin === userPin) {
      clearMessage();
      renderMenu();
    } else {
      pinTries++;
      showMessage('Incorrect PIN. Try again.');
      pin = '';
      updatePinDots();
      if (pinTries >= 3) {
        showMessage('Card blocked. Please contact your bank.');
        cardBlocked = true;
        setTimeout(resetATM, 2000);
      }
    }
  }

  function renderMenu() {
    state = 'menu';
    screen.innerHTML = `
      <h2 style="color:#232b3e;font-weight:700;margin-bottom:18px;">Main Menu</h2>
      <div style="width:100%;display:flex;flex-direction:column;gap:14px;">
        <button class="atm-btn" data-action="balance">Balance</button>
        <button class="atm-btn" data-action="ministatement">Mini Statement</button>
        <button class="atm-btn" data-action="withdraw">Withdraw</button>
        <button class="atm-btn" data-action="deposit">Deposit</button>
        <button class="atm-btn" data-action="transfer">Transfer</button>
        <button class="atm-btn" data-action="changepin">Change PIN</button>
        <button class="atm-btn" data-action="exit">Exit</button>
      </div>
    `;
    clearKeypad();
    screen.querySelectorAll('.atm-btn').forEach(btn => {
      btn.onclick = function() {
        const action = btn.getAttribute('data-action');
        if (action === 'balance') renderBalance();
        else if (action === 'ministatement') renderMiniStatement();
        else if (action === 'withdraw') renderWithdraw();
        else if (action === 'deposit') renderDeposit();
        else if (action === 'transfer') renderTransferAccount();
        else if (action === 'changepin') renderChangePin();
        else if (action === 'exit') resetATM();
      };
    });
  }

  function renderBalance() {
    screen.innerHTML = `
      <h2 style="color:#232b3e;font-weight:700;margin-bottom:16px;">Account Balance</h2>
      <div style="font-size:2.2rem;font-weight:700;color:#1e90d6;margin-bottom:24px;">₹ ${balance.toLocaleString()}</div>
      <button class="atm-btn" id="back-menu">Back to Menu</button>
    `;
    clearKeypad();
    document.getElementById('back-menu').onclick = renderMenu;
  }

  function renderMiniStatement() {
    screen.innerHTML = `
      <h2 style='color:#232b3e;font-weight:700;margin-bottom:16px;'>Mini Statement</h2>
      <ul style='width:100%;max-height:180px;overflow-y:auto;padding:0 0 0 8px;margin-bottom:18px;list-style:none;'>
        ${history.length === 0 ? '<li style="color:#3a4a5d;">No transactions yet.</li>' :
          history.slice(0,5).map(tx => `<li style='margin-bottom:6px;color:#232b3e;'>${tx.date}: ${tx.type} ₹${tx.amount}${tx.to ? ' to ' + tx.to : ''}</li>`).join('')}
      </ul>
      <button class='atm-btn' id='back-menu'>Back to Menu</button>
    `;
    clearKeypad();
    document.getElementById('back-menu').onclick = renderMenu;
  }

  function renderWithdraw() {
    inputBuffer = '';
    screen.innerHTML = `
      <h2 style="color:#232b3e;font-weight:700;margin-bottom:16px;">Withdraw</h2>
      <div style="font-size:1.1rem;color:#3a4a5d;margin-bottom:8px;">Enter amount (multiples of 10)</div>
      <div id="amount-disp" style="font-size:2rem;font-weight:700;color:#1e90d6;margin-bottom:12px;">₹ 0</div>
      <div id="atm-message" class="atm-message"></div>
      <button class="atm-btn" id="cancel-wd">Cancel</button>
    `;
    renderKeypad('amount',
      (digit) => {
        if (inputBuffer.length < 6) {
          inputBuffer += digit;
          updateAmountDisp();
        }
      },
      () => {
        const amt = parseInt(inputBuffer, 10);
        if (!amt || amt <= 0 || amt % 10 !== 0) {
          showMessage('Enter a valid amount.');
          return;
        }
        if (amt > balance) {
          showMessage('Insufficient balance.');
          return;
        }
        balance -= amt;
        history.unshift({ type: 'Withdraw', amount: amt, date: new Date().toLocaleString() });
        showMessage(`Withdrawn ₹${amt}. New balance: ₹${balance}`, '#1e90d6');
        setTimeout(renderMenu, 1200);
      },
      () => {
        inputBuffer = inputBuffer.slice(0, -1);
        updateAmountDisp();
      }
    );
    document.getElementById('cancel-wd').onclick = renderMenu;
  }
  function updateAmountDisp() {
    document.getElementById('amount-disp').textContent = '₹ ' + (inputBuffer || '0');
    clearMessage();
  }

  function renderDeposit() {
    inputBuffer = '';
    screen.innerHTML = `
      <h2 style="color:#232b3e;font-weight:700;margin-bottom:16px;">Deposit</h2>
      <div style="font-size:1.1rem;color:#3a4a5d;margin-bottom:8px;">Enter amount (multiples of 10)</div>
      <div id="amount-disp" style="font-size:2rem;font-weight:700;color:#1e90d6;margin-bottom:12px;">₹ 0</div>
      <div id="atm-message" class="atm-message"></div>
      <button class="atm-btn" id="cancel-dp">Cancel</button>
    `;
    renderKeypad('amount',
      (digit) => {
        if (inputBuffer.length < 6) {
          inputBuffer += digit;
          updateAmountDisp();
        }
      },
      () => {
        const amt = parseInt(inputBuffer, 10);
        if (!amt || amt <= 0 || amt % 10 !== 0) {
          showMessage('Enter a valid amount.');
          return;
        }
        balance += amt;
        history.unshift({ type: 'Deposit', amount: amt, date: new Date().toLocaleString() });
        showMessage(`Deposited ₹${amt}. New balance: ₹${balance}`, '#1e90d6');
        setTimeout(renderMenu, 1200);
      },
      () => {
        inputBuffer = inputBuffer.slice(0, -1);
        updateAmountDisp();
      }
    );
    document.getElementById('cancel-dp').onclick = renderMenu;
  }

  function renderTransferAccount() {
    inputBuffer = '';
    screen.innerHTML = `
      <h2 style="color:#232b3e;font-weight:700;margin-bottom:16px;">Transfer</h2>
      <div style="font-size:1.1rem;color:#3a4a5d;margin-bottom:8px;">Enter recipient account number</div>
      <div id="account-disp" style="font-size:1.3rem;font-weight:700;color:#1e90d6;margin-bottom:12px;">-</div>
      <div id="atm-message" class="atm-message"></div>
      <button class="atm-btn" id="cancel-tf">Cancel</button>
    `;
    renderKeypad('account',
      (digit) => {
        if (inputBuffer.length < 12) {
          inputBuffer += digit;
          updateAccountDisp();
        }
      },
      () => {
        if (inputBuffer.length < 6) {
          showMessage('Enter a valid account number.');
          return;
        }
        transferAccount = inputBuffer;
        renderTransferAmount();
      },
      () => {
        inputBuffer = inputBuffer.slice(0, -1);
        updateAccountDisp();
      }
    );
    document.getElementById('cancel-tf').onclick = renderMenu;
  }
  function updateAccountDisp() {
    document.getElementById('account-disp').textContent = inputBuffer || '-';
    clearMessage();
  }
  function renderTransferAmount() {
    inputBuffer = '';
    screen.innerHTML = `
      <h2 style="color:#232b3e;font-weight:700;margin-bottom:16px;">Transfer</h2>
      <div style="font-size:1.1rem;color:#3a4a5d;margin-bottom:8px;">Enter amount (multiples of 10)</div>
      <div id="amount-disp" style="font-size:2rem;font-weight:700;color:#1e90d6;margin-bottom:12px;">₹ 0</div>
      <div id="atm-message" class="atm-message"></div>
      <button class="atm-btn" id="cancel-tfamt">Cancel</button>
    `;
    renderKeypad('amount',
      (digit) => {
        if (inputBuffer.length < 6) {
          inputBuffer += digit;
          updateAmountDisp();
        }
      },
      () => {
        const amt = parseInt(inputBuffer, 10);
        if (!amt || amt <= 0 || amt % 10 !== 0) {
          showMessage('Enter a valid amount.');
          return;
        }
        if (amt > balance) {
          showMessage('Insufficient balance.');
          return;
        }
        balance -= amt;
        history.unshift({ type: 'Transfer', amount: amt, to: transferAccount, date: new Date().toLocaleString() });
        showMessage(`Transferred ₹${amt} to ${transferAccount}. New balance: ₹${balance}`, '#1e90d6');
        setTimeout(renderMenu, 1400);
      },
      () => {
        inputBuffer = inputBuffer.slice(0, -1);
        updateAmountDisp();
      }
    );
    document.getElementById('cancel-tfamt').onclick = renderMenu;
  }

  function renderChangePin() {
    let step = 0;
    let oldPin = '', newPin = '', confirmPin = '';
    function renderStep() {
      let label = step === 0 ? 'Enter current PIN' : (step === 1 ? 'Enter new PIN' : 'Confirm new PIN');
      let dots = (step === 0 ? oldPin : step === 1 ? newPin : confirmPin).split('').map(()=>'•').join('');
      screen.innerHTML = `
        <h2 style="color:#232b3e;font-weight:700;margin-bottom:16px;">Change PIN</h2>
        <div style="font-size:1.1rem;color:#3a4a5d;margin-bottom:8px;">${label}</div>
        <div id="pin-dots" style="display:flex;gap:12px;justify-content:center;margin-bottom:18px;">
          <span class="pin-dot">${dots[0]||''}</span>
          <span class="pin-dot">${dots[1]||''}</span>
          <span class="pin-dot">${dots[2]||''}</span>
          <span class="pin-dot">${dots[3]||''}</span>
        </div>
        <div id="atm-message" class="atm-message"></div>
        <button class="atm-btn" id="cancel-chpin">Cancel</button>
      `;
      renderKeypad('pin',
        (digit) => {
          if (step === 0 && oldPin.length < 4) {
            oldPin += digit;
            updatePinDotsChangePin(oldPin);
          } else if (step === 1 && newPin.length < 4) {
            newPin += digit;
            updatePinDotsChangePin(newPin);
          } else if (step === 2 && confirmPin.length < 4) {
            confirmPin += digit;
            updatePinDotsChangePin(confirmPin);
          }
        },
        () => {
          if (step === 0 && oldPin.length === 4) {
            if (oldPin !== userPin) {
              showMessage('Current PIN is incorrect.');
              oldPin = '';
              updatePinDotsChangePin(oldPin);
              return;
            }
            step = 1; renderStep();
          } else if (step === 1 && newPin.length === 4) {
            if (!/^[0-9]{4}$/.test(newPin)) {
              showMessage('New PIN must be 4 digits.');
              newPin = '';
              updatePinDotsChangePin(newPin);
              return;
            }
            step = 2; renderStep();
          } else if (step === 2 && confirmPin.length === 4) {
            if (newPin !== confirmPin) {
              showMessage('New PINs do not match.');
              confirmPin = '';
              updatePinDotsChangePin(confirmPin);
              return;
            }
            userPin = newPin;
            showMessage('PIN changed successfully!', '#1e90d6');
            setTimeout(renderMenu, 1200);
          }
        },
        () => {
          if (step === 0 && oldPin.length > 0) {
            oldPin = oldPin.slice(0, -1);
            updatePinDotsChangePin(oldPin);
          } else if (step === 1 && newPin.length > 0) {
            newPin = newPin.slice(0, -1);
            updatePinDotsChangePin(newPin);
          } else if (step === 2 && confirmPin.length > 0) {
            confirmPin = confirmPin.slice(0, -1);
            updatePinDotsChangePin(confirmPin);
          }
        }
      );
      document.getElementById('cancel-chpin').onclick = renderMenu;
    }
    function updatePinDotsChangePin(val) {
      const dots = screen.querySelectorAll('.pin-dot');
      for (let i = 0; i < 4; i++) {
        dots[i].textContent = val[i] ? '•' : '';
      }
      clearMessage();
    }
    renderStep();
  }

  // Start ATM
  resetATM();
}); 