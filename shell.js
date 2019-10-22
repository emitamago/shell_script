const shell = require('shelljs');
const prompt = require('prompt');
const SHA1 = require("crypto-js/sha1");
// const mindedHash = require('./proofOfWork')

// Eliminate unwanted prompt message
prompt.message = ""

// Environment variable
const shellVariables = shell.env

prompt.start();


prompt.get({
    properties: {
        commitMessage: {
            description: "Please input your commit message",
            type: 'string',
            required: true
        }
    }
}, function (err, result) {
    if (err) {
        console.log(err);
        return 1;
    } else {
        shellVariables["message"] = result.commitMessage
        shellVariables["tree"] = shell.exec(`git write-tree`)
        shellVariables["parentTree"] = shell.exec(`git rev-parse HEAD`)
        shellVariables["user"] = shell.exec('git config user.name')
        shellVariables["email"] = shell.exec('git config user.email')
        var committer = `${shellVariables["user"].trim()} <${shellVariables["email"].trim()}>`
         var sampleCommit = "tree `git write-tree`\nparent `git rev-parse HEAD`\nauthor Dan Kozlowski <koz@planetscale.com> 1545187366 +0500\ncommitter Dan Kozlowski <koz@planetscale.com> 1545187366 +0500\n\n${message}"
        
        var time = Date.now()
        let hash = createHash(sampleCommit)
        let i = 0
        while(hash.substring(0, 4) !== "0000") {
            time++
            var commit =
                'tree ' + shellVariables["tree"] +
                'parent ' + shellVariables["parentTree"] +
                'author ' + committer + ' ' + time + ' +0500' + '\n' +
                'committer ' + committer + ' ' + time + ' +0500' + '\n' +
                '\n' + shellVariables["message"];
            var commitMessage2 = `commit    ${commit.length}${commit}`
            hash = createHash(commitMessage2)  
        }
        var correctCommit =
                'tree ' + shellVariables["tree"] +
                'parent ' + shellVariables["parentTree"] +
                'author ' + committer + ' ' + time + ' +0500' + '\n' +
                'committer ' + committer + ' ' + time + ' +0500' + '\n' +
                '\n' + shellVariables["message"];
            var correctCommitMessage = `commit    ${correctCommit.length}${correctCommit}`
            // console.log("correct message is", correctCommitMessage)
            // console.log("hash is", createHash(correctCommitMessage))
        shellVariables["correctHash"] = shell.echo('-en', correctCommit).exec('git hash-object -t commit -w --stdin')
        shell.exec(`git reset --hard ${shellVariables["correctHash"]}`)

        // increment time by 1 until resulting hash has difficulty number of zero
        // while(hash.substring(0, 6) !== "000000"){


        // }

    }

    // shellVariables["finalcommit"] = commitMessage2


    // shell.exec(`echo -en ${shellVariables["finalcommit"] }  | shasum`)
    // shellVariables['hash']= shell.exec(`echo -en ${commit} | git hash-object  -w --stdin`)
    // shasum.update(commitMessage2);
    // console.log(shasum.digest('hex'));
    // console.log(commitMessage2)
    // \0 ${ENVIROMENT_VARIABLES["commit"]}\n" | shasum


});

// create hash using sha1
function createHash(string) {
    return SHA1(string).toString()
}


