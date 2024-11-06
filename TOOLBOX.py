import warnings

# created this because I wanted to filter out bad input
def promptFloatOld(prompt:str):
    warnings.warn("promptFloatOld() is obsolete, please use promptFloat()",DeprecationWarning,2)
    '''Prompts user for a float value, uses input validation.'''
    value_input = ""
    while True:
        value_input = input(prompt)
        try:
            return float(value_input)
        except ValueError:
            print("Please enter a valid decimal number!")

def promptIntOld(prompt:str):
    warnings.warn("promptIntOld() is obsolete, please use promptInt()",DeprecationWarning,2)
    '''Prompts user for an int value, uses input validation.'''
    value_input = ""
    while True:
        value_input = input(prompt)
        try:
            return int(value_input)
        except ValueError:
            print("Please enter a valid integer!")

def promptOptions(prompt:str, options:list[str]):
    '''Prompts user with options. returns the option number. 
    
    Note that \'prompt\' is printed after the options are.'''
    value_input = ""
    while True:
        option_tick = 1
        for option in options:
            print(f"{str(option_tick)} : {option}")
            option_tick += 1

        value_input = input(prompt)
        try:
            num = int(value_input)
            if(num < len(options) + 1 and num != 0):
                return int(value_input)
            else:
                print(f"Please enter a number between 1 and {len(options)}")
            
        except ValueError:
            print("Please enter a number from the list below")

def promptInt(prompt:str, min:int=None, max:int=None):
    '''Prompts the user for an int also has options for min and max value.'''
    value_input = ""
    while True:
        value_input = input(prompt)
        try:
            num = int(value_input)
            if (min is None or num >= min) and (max is None or num <= max):
                return num
            else:
                if min is None:
                    print(f"Value must be less than or equal to {max}")
                    
                elif max is None:
                    print(f"Value must be greater than or equal to {min}")
                else:
                    print(f"Value must be within {min} and {max}")


        except ValueError:
            print("Please enter a valid integer!")

def promptYN(prompt:str):
    '''Prompts the user for a Y or N value.

    accepts Y , N , YES , NO in upper and lower case
    
    Returns a Bool.'''
    while True:
        value = input(prompt)
        if value.lower() == "y" or value.lower() == "yes":
            return True
        elif value.lower() == "n" or value.lower() == "no":
            return False
        else:
            print("input must be the letter 'Y' or 'N'")

def promptFloat(prompt:str,  min:float=None, max:float=None):
    '''Prompts the user for a float also has options for min and max value.'''
    value_input = ""
    while True:
        value_input = input(prompt)
        try:
            num = float(value_input)
            if (min is None or num >= min) and (max is None or num <= max):
                return num
            else:
                if min is None:
                    print(f"Value must be less than or equal to {max}")
                    
                elif max is None:
                    print(f"Value must be greater than or equal to {min}")
                else:
                    print(f"Value must be within {min} and {max}")
        except ValueError:
            print("Please enter a valid decimal number!")
# ------------------------------------------------------------------------------
import os

def clear_console():
    '''clears the console for windows, mac, and linux'''
    # For Windows
    if os.name == 'nt':
        os.system('cls')
    # For Linux/Mac
    else:
        os.system('clear')

# ------------- BEE movie ------------------
import urllib.request
import json
import time
def printBeeMovie():
    '''Prints out the bee movie script line by line
    
    Warning: Takes a long time'''
    url = "https://courses.cs.washington.edu/courses/cse163/20wi/files/lectures/L04/bee-movie.txt"

    try:
        with urllib.request.urlopen(url) as response:
                data = response.read().decode()
        
        for line in data:
            print(line,end="")
            time.sleep(.043)

    except Exception as e:
        pass
