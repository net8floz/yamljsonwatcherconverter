# Getting Started

## What is it
Ever have a folder full of json files that you hate writing in? Rather write in yaml and have that folder instantly converted to json for your lame json accepting project? Use this. 

This will watch all files in an "in" folder containing yaml files and then delete all files in an "out" folder and replace them with json files.

Yaml "in" directory may contain sub folders. 

## Install it

```
cd myAwesome/Project
npm install -g yamljsonwatcherconverter 
```

## Create the config file 

Example folder structure:
```
- in
-- myFile.yaml
- out
- yamljsonwatcherconverter.json <--- create this one 
```

Example config file. Config should be in the same dir you execute this package in.
```
{
    inPath: './in',
    outPath: './out'
}
```

## Run it 
```
yamljsonwatcherconverter
```

## Take note 
By default this application will only tell you what it intends to do. Create your config and then run the command. Read the output to make sure everything looks okay

If everything looks good run the command with the force argument to allow file system changes

```
yamljsonwatcherconverter --force
```

## Don't be a dummy
This application is designed to delete entire folders recursilvey ( destroys output folder ). Don't give it a an important path or it will try and delete all those folders and files.
