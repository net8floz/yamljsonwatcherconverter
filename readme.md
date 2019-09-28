# Getting Started

## Install it

```
cd myAwesome/Project
npm init
npm install -g yamljsonwatcherconverter 
```

## Create the config file 

Example folder structure:
```
- .packages.json
- in
-- myFile.yaml
- out
- yamljsonwatcherconverter.json <--- create this one 
```

Example config file
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
yamljsonwatcherconver --force
```

## Don't be a dummy
This application is designed to delete entire folders recursilvey ( destroys output folder ). Don't give it a an important path or it will try and delete all those folders and files.
