const   shell = require('shelljs');
const prompt = require('prompt');

// Eliminate unwanted prompt message
prompt.message = ""

// Environment variable
const ENVIROMENT_VARIABLES = shell.env

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
        ENVIROMENT_VARIABLES["message"] = result.commitMessage
        ENVIROMENT_VARIABLES["tree"] = shell.exec(`git write-tree`)
        ENVIROMENT_VARIABLES["parentTree"] = shell.exec(`git rev-parse HEAD`)
        ENVIROMENT_VARIABLES["commit"] =`tree ${ENVIROMENT_VARIABLES["tree"]}\nparent ${ENVIROMENT_VARIABLES["parentTree"] }\nauthor Dan Kozlowski <koz@planetscale.com> 1545187366 +0500\ncommitter Dan Kozlowski <koz@planetscale.com> 1545187366 +0500\n\n${ENVIROMENT_VARIABLES["message"]}`
       console.log( ENVIROMENT_VARIABLES["commit"])
    }
});


