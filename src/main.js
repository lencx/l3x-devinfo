const os = require('os');
const fs = require('fs-extra');
const ip = require('l3x-ip');

const _platform = os.platform(),
    isMac = _platform === 'darwin',
    OSUsername = isMac ? os.userInfo().username : os.hostname(),
    OSPlatform = isMac ? 'macOS' : _platform

/**
 * Get developer information
 * @param string filename
 */
module.exports = filename => {
    filename = filename || 'devinfo.json'
    filename = /^\//.test(filename) ? filename.substr(1) : filename
    const writeJson = (data, print) => fs.writeJson(filename, data, {spaces: 2})
        .then(() => console.log(`\x1b[40m${filename}\x1b[0m `, print))
    let info = {
        username: OSUsername,
        platform: OSPlatform,
        'IP Record': [ip],
        // 'Current IP'
    };
    fs.exists(filename)
        .then(exist => {
            let _newuser = `New user \x1b[31m${info.username}\x1b[0m IP: \x1b[33m${ip}\x1b[0m`
            if(!exist) {
                fs.ensureFileSync(filename, err => {
                    // console.log(err) // => null
                    // dir has now been created, including the directory it is to be placed in
                })
                writeJson([info], _newuser)
            } else {
                fs.readJSON(filename)
                    .then(data => {
                        let exist = false
                        const delIP = () => data.map((item, i) => delete data[i]['Current IP'])
                        data.map(item => {
                            if(item.username === info.username) {
                                exist = true
                                let _user = `\x1b[31m${item.username}\x1b[0m`
                                let _ip = `\x1b[33m${ip}\x1b[0m`
                                if(!item['IP Record'].includes(ip)) {
                                    item['Current IP'] = ip
                                    item['IP Record'].push(ip)
                                    writeJson(data, `${_user} added IP: ${_ip}`)
                                }
                                else {
                                    if(item['Current IP'] !== ip && (data.length > 1 || item['IP Record'].length > 1)) {
                                        delIP()
                                        item['Current IP'] = ip
                                        writeJson(data, `${_user} current IP update: ${_ip}`)
                                    }
                                }
                            }
                        })
                        if(!exist) {
                            delIP()
                            data.push(Object.assign(info, {'Current IP': ip}))
                            writeJson(data, _newuser)
                        }
                    })
            }
        })
}