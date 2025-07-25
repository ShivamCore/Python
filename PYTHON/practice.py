#data types in python = types of value a variable can hold 
# #numeric data types
# int = 10
# float=10.9,2.5
# complex= 10+2j,1+2i


# a =150+6j
# print(type(a))


#string data types 

# str = "100"
# print(type(str))


#boolean data types
# bool = True,False
# is_python_easy_coding_language = True
# print(type(is_python_easy_coding_language))


#sequence data types
# list = [1,2,3,4,5,6,7,8,9]
# print(type(list))
# tuple = (1,2,3,4,5,6,7,8,9)
# print(type(tuple))
# range = range(1,10) 
# print(list(range),type(range))



## set data types
# set = {1,2,3,4,5,6,7,8}
# print(type(set))



#mapping data types
# dict = {"name":"Ankur","age":20,"location":"delhi"}
# print(type(dict))




#>>>>>>>>>>>>>>>>>>>>>>>>>>>>>operator<<<<<<<<<<<<<<<<<<<<<<
# 1. Arithmetic Operators
# a = 10
# b = 3

# print("Arithmetic Operators:")
# print("a + b =", a + b)    # 13
# print("a - b =", a - b)    # 7
# print("a * b =", a * b)    # 30
# print("a / b =", a / b)    # 3.333...
# print("a % b =", a % b)    # 1
# print("a // b =", a // b)  # 3
# print("a ** b =", a ** b)  # 1000
# # print()




#>>>>>>>>>>>>>>>>>>>>>>tuple<<<<<<<<<<<<<
# A tuple is an ordered, immutable (unchangeable) collection. 
# tpl = (1, 2, 3, 4, 2,2,5)
# print(tpl)
# print(type(tpl))
# print(len(tpl))
# print(tpl[3])
# print(tpl[0:3])
# print(tpl.count(2))
#tuple unpacking 
# a,b,c = 2,4,6
# print("tuple unpacking")
# print(a)
# print(b)
# print(c)

# tpl =(1, 2, 3, 4, 5, 6, 7, 8, 9)
# print(max(tpl))
# print(min(tpl))
# print(sum(tpl))




#>>>>>>>>>>>>>>>>.....set<<<<<<<<<<<<<<<<<<<
# A set is an unordered collection of unique elements.
# my_set = {1, 2, 3, 4, 5, 6, 7, 8, 9}
# print(my_set)
# my_set.add(10)
# print(my_set)
# my_set.remove(8)
# print(my_set)

#union of two sets 
# s1 = {1, 2, 3}
# s2 = {3, 4, 5}
# print(s1|s2)

#intersection of two sets 
# S1 = {1, 2, 3}
# S2 = {3, 4, 5}
# print(S1 & S2)



 #2. Comparison Operators 
# a = 10
# b = 20
# print("Comparison Operators:")
# print("a == b:", a == b)   # False
# print("a != b:", a != b)   # True
# print("a > b:", a > b)     # False
# print("a < b:", a < b)     # True
# print("a >= b:", a >= b)   # False
# print("a <= b:", a <= b)   # True
# print()


# bitwise , # logical , identity , membership , assignment operators

# # 3. Logical Operators
# x = True
# y = False

# print("Logical Operators:")
# print("x and y:", x and y)  # False
# print("x or y:", x or y)    # True
# print("not x:", not x)      # False
# print()


# # 4. Assignment Operators
# print("Assignment Operators:")
# c = 5
# print("c =", c)
# c += 2
# print("c += 2 ->", c)
# c *= 3
# print("c *= 3 ->", c)
# c -= 4
# print("c -= 4 ->", c)
# c //= 2
# print("c //= 2 ->", c)
# c **= 2
# print("c **= 2 ->", c)
# print()


# # 5. Bitwise Operators
# print("Bitwise Operators:")
# p = 5       # 0101
# q = 3       # 0011
# print("p & q =", p & q)     # 0001 -> 1
# print("p | q =", p | q)     # 0111 -> 7
# print("p ^ q =", p ^ q)     # 0110 -> 6
# print("~p =", ~p)           # -(p+1) -> -6
# print("p << 1 =", p << 1)   # 1010 -> 10
# print("p >> 1 =", p >> 1)   # 0010 -> 2
# print()

# # 6. Membership Operators
# print("Membership Operators:")
# list1 = [1, 2, 3, 4]
# print("2 in list1:", 2 in list1)        # True
# print("5 not in list1:", 5 not in list1)  # True
# print()

# # 7. Identity Operators
print("Identity Operators:")
m = [1, 2, 3]
n = m
o = [1, 2, 3]
print("m is n:", m is n)         # True
print("m is o:", m is o)         # False
print("m == o:", m == o)         # True (values are equal)
