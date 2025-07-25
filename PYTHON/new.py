#conditional statements 
#1. if 
# age = 19
# if age >= 18:
#    print("you are eligible to vote")





# 2. if _else
# age = 17
# if age >= 18:
#    print("you are eligible to vote")
# else:
#     print("you are not eligible to vote" )



# 3. if _elif _else
# marks = 50

# if marks >= 90:
#     print("Grade A")
# elif marks >= 75:
#     print("Grade B")
# elif marks >= 60:
#     print("Grade C")
# else:
#     print("Fail")



# task 1: find the largest number among three numbers
# a = int(input(" enter first number"))
# b = int(input(" enter second number"))
# c = int(input(" enter third number"))
# if a>b and a>c:
#     print("largest number is", a)
# elif b>a and b>c:
#     print("largest number is", b)
# else:
#     print("largest number is", c)
    
    
    
    # task2 find even and odd number 
    
    
    # >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>loops<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
# for loop
# for varible in sequence:
#for loop in list 
# list = [1, 2, 3, 4, 5]
# for numbers in list:
#     print(numbers)


# for loop on string 
# string = "hello"
# for letters in string:
#     print(letters)
    
    
    
# for loop in range 
# for i in range(1,10):
#     print(i)    
    
    
    
    
  # while loop 
# while condition:
# count = 1
# while count <=5:
#     print(count)
#     count +=1   


#loop control statements
# break statement and continue statement
# for i in range(1,10):
#     if i ==5:
#         continue
#     print(i)



#>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>function<<<<<<<<<<<<<<<<<<<<<<<<
# A function is a block of code that only runs when it is called.

# def function_name():

# def display():
#     print("hello world")
# display()




# def add():
#     a = 5
#     b= 6
#     print(a+b)
# add()





#>>>>>>>>....lambda function....<<<<<<<<<<<<<<<<<<<<<<<<<
# add  = lambda a,b : a+b
# print(add(10,20))




# def check_even_odd(num):
#     if num%2==0:
#         print("even")
#     else:
#         print("odd")
        
# check_even_odd(10)


#>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>oops in python<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
# 1. class and object 
# class Person:
#     def greet(self):
#         print("Hello, I am a person!")

# # Create object
# p = Person()
# p.greet()

# 2. inhertitance
# class Animal:
#     def speak(self):
#         print("Animal speaks")

# class Dog(Animal):
#     def bark(self):
#         print("Dog barks")

# d = Dog()
# d.speak()  # Inherited
# d.bark()   # Own method





# 3.encapsulation
# class Account:
#     def __init__(self, balance):
#         self.__balance = balance  # private variable

#     def show(self):
#         print("Balance:", self.__balance)

# a = Account(5000)
# a.show()
# >>>>>>>>>>>>>>>>>>>>>>>polymorphism<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
# class Cat:
#     def sound(self):
#         print("Meow")

# class Dog:
#     def sound(self):
#         print("Bark")

# for animal in (Cat(), Dog()):
#     animal.sound()



#>>>>>>>>>>>>>>>>file handling<<<<<<<<<<<<<<<<<<<<<<<<<
# r = read file 
# w= write file 
# a = append file
# x= create file 


#create a file
# Create and write to a file
# f = open("myfile.txt", "w")
# f.write("Hello, this is my first file!")
# f.close()

# print("File created and written successfully.")


# read a file 

