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
        
        while (!hash.startsWith("0000", 0)) {
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
        
         // var correctCommitMessage = `commit    ${correctCommit.length}${correctCommit}`

        shellVariables["correctHash"] = shell.echo('-en', correctCommit).exec('git hash-object -t commit -w --stdin')
        shell.exec(`git reset --hard ${shellVariables["correctHash"]}`)
    }
});

// create hash using sha1
function createHash(string) {
    return SHA1(string).toString()
}


