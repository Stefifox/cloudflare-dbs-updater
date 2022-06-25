# cloudflare-dbs-updater

This app help you to update a dns record on CloudFlare with your IP.

The app get automatically the ID of the record and your public IP, you can also receive a notification on one of your Telegram Bot

## Installation

Download the latest version from GitHub

``` git clone https://github.com/Stefifox/cloudflare-dns-updater.git ```

Install packages using your favorite package manager

- NPM

``` npm i --save ```

- Yarn

``` yarn install ```

## Configuration

Create 'appsettings.json' file in main directory

Copy and paste into the file

```

{
  "appConfiguration": {
    "jobRefresh": "* * * * * *",
    "telegram": false
  },
  "cloudflare": {
    "token": "[YOUR TOKEN FROM CLOUFLARE]",
    "zoneId": "[YOUR ZONE ID]",
    "recordName": "[NAME OF THE RECORD]",
    "recordDomain": "[NAME OF THE DOMAIN]"
  },
  "telegram": {
    "botName": "",
    "botKey": ""
  }
}

```

The default update settings is every 1 second (* * * * * *), edit this string with your setting. 
For example, I use every day at 23:59 (0 59 23 * * *)

## Start the APP

Start the app with ``` npm start ``` or ``` yarn start ```
