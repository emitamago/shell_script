const SHA1 = require("crypto-js/sha1");

// create hash using sha1
function createHash(string){
    return SHA1(string).toString()
}

function minedHash(time, commit){
    // adding time manually
    
    let hash = createHash(commit)
    let i = 0
    // increment time by 1 until resulting hash has difficulty number of zero
    // while(hash.substring(0, 6) !== "000000"){
        while(i < 10){
            time++
            let possibleCommit = commit
            var commitMessage2 = `commit    ${possibleCommit.length}${possibleCommit}`
            hash = createHash(commitMessage2) 
            i++
            console.log(hash, time)
        }
        
    // }
    
}

module.exports = minedHash;

 