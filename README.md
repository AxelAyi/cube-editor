# cube-editor 

This project is a simple 2D R desktop cube editor powered by Node Webkit.
Its primary purpose was to help a writter making a book about cube solving tutorials.

You may use it to color a SVG cube before saving it as a new SVG file.

## <a name="building"></a> Building

First install or update your local project's **npm** modules:

```bash
# First install all the NPM modules:
npm install

# Or update
npm update
```

```bash
# Install gulp and bower
npm install -g gulp bower
```

Then run the **gulp** tasks:

```bash
# To build the executable app
gulp build
```

## Overview

![alt tag](https://raw.githubusercontent.com/akakwel/cube-editor/develop/cube-editor.gif)

## How to use it

### Changing a face color

To change a face color, click on the square and **use the keyboard arrows (left, right, up, down)**.
The color will be changed based on the displayed default colors on top. 
This is not user friendly but it was a quick win for a first iteration. To be improved in the future.

### Changing the default colors

#### At run time

You can change the available colors by clicking on the color boxes on top

#### In a configuration file

Create a "colors.json" file at the root of the application and put inside the following content :

```bash
{
	"colors": [
        "#646464",
		"#5B6C98",
		"#FFFFFF",
		"#FD8C3C",
		"#84d2a8",
		"#f6dc64",
		"#dd362a"
	]
}
```
Then, change the colors as you like.
