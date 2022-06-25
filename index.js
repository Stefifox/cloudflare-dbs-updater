const axios = require('axios')
const cron = require('node-cron')

const appSettings = require('./appsettings.json')

const validate = key =>{
    return key.length > 0
}

async function getRecordId (zoneId, recordName){

    return new Promise((resolve, reject)=>{
        axios.get(`https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records`)
            .then(res=>{
                res.data.result.forEach(e=>{
                    const name = e.name.split('.')[0]
                    if(name === recordName){
                        return resolve(e.id)
                    }
                })
            })
    })

}

async function getMyIp(){

    return new Promise((resolve,reject)=>{
        axios.get("https://httpbin.org/ip")
            .then(res=>{
               return resolve(res.data.origin)
            })
    })

}

async function updateDNS(recordId, myIP){

    const recordName = `${appSettings.cloudflare.recordName}.${appSettings.cloudflare.recordDomain}`

    return new Promise((resolve, reject)=>{
        console.log("Updating DNS...")
        axios.put(`https://api.cloudflare.com/client/v4/zones/${appSettings.cloudflare.zoneId}/dns_records/${recordId}`, {type: 'A', name: recordName, ttl: 1, content: myIP})
            .then(res => {
            return resolve()
        })
    })
}

function job(recordId){

    const updateJob = cron.schedule(appSettings.appConfiguration.jobRefresh, () =>{
        console.log("Getting public IP:")
        getMyIp()
            .then(myIP=>{
                console.log(myIP)
                updateDNS(recordId, myIP).then(()=> console.log('OK'))
            })
    })

    console.log("Starting job with " + appSettings.appConfiguration.jobRefresh)
    updateJob.start()
}

const startUp = () =>{

    const {token, zoneId, recordName, recordDomain} =  appSettings.cloudflare

    if(validate(token) && validate(zoneId) && validate(recordName) && validate(recordDomain)){
        // Initialize the job
        axios.defaults.headers.common['Authorization'] = "Bearer "+ token;
        console.log("Getting record id:")
        getRecordId(zoneId, "vpn")
            .then(id=> {
                console.log(id)
                job(id)
            })
    }else{
        console.log('The app was closed due to the following errors:')
        if(!validate(token)) console.log("The token for CloudFlare can not be void")
        if(!validate(zoneId)) console.log("The zone id for CloudFlare can not be void")
        if(!validate(recordName)) console.log("The record name for CloudFlare can not be void")
        if(!validate(recordDomain)) console.log("The record domain for CloudFlare can not be void")
        process.exit(1);
    }

}

startUp()