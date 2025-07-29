const fs = require('fs'); // Importing the file system module to handle file operations
const args = process.argv; //process.argv returns an array in which there is the location of node modules, current working directory, and further arguments passed.
const path = require('path');
const currentWorkingDirectory = path.dirname(args[1]) + path.sep; //args[1] is the path to the script file

//check if todo.txt and done.txt already exist in cwd, if not then create
if (fs.existsSync(currentWorkingDirectory + ('todo.txt')) === false) {
    let createStream = fs.createWriteStream(currentWorkingDirectory + ('todo.txt'));
    createStream.end();
}
if (fs.existsSync(currentWorkingDirectory + ('done.txt')) === false) {
    let createStream = fs.createWriteStream(currentWorkingDirectory + ('done.txt'));
    createStream.end();
}

// Info Function:
// It will display the usage format. It will be called when help is passed as an argument or when no argument is passed.
const infoFunction = () => {
    const usageText = `
    usage :-
    $ node index.js add "todo item"  # Add a new todo
    $ node index.js ls               # Show remaining todos
    $ node index.js del NUMBER       # Delete a todo
    $ node index.js done NUMBER      # Complete a todo
    $ node index.js help             # Show usage
    $ node index.js report           # Statistics`;
    console.log(usageText);
};

// list function:It will read the data from todo.txt and display them with a corresponding number. Most Recent is displayed on the top with the largest number.
const listFunction = () => {
    let data = [];
    //read todo.txt and convert to string
    const fileData = fs.readFileSync(currentWorkingDirectory + ('todo.txt'), 'utf-8').toString();
    //split string and store in array
    data = fileData.split('\n');

    let filterData = data.filter(function (value) {
        return value.trim() !== ''; //filter out empty lines
    });

    if (filterData.length === 0) {
        console.log('There are no pending todos!');
        return;
    }

    for (let i = filterData.length - 1; i >= 0; i--) {
        console.log((filterData.length - i) + '. ' + filterData[i]);
    }
};

const addFunction = () => {
    const newTask = args[3];
    if (newTask) {
        let data = [];
        const fileData = fs.readFileSync(currentWorkingDirectory + ('todo.txt'), 'utf-8').toString();
        fs.writeFileSync(currentWorkingDirectory + ('todo.txt'), fileData + newTask + '\n',
            function (err) {
                if (err) throw err;
                console.log('Added todo: "' + newTask + '"');
            });
    } else {
        console.log('Error: Missing todo string. Nothing added!');
    }
};

const deleteFunction = () => {

    // Store which index is passed
    const deleteIndex = args[3];

    // If index is passed
    if (deleteIndex) {

        // Create a empty array
        let data = [];

        // Read the data from file and convert
        // it into string
        const fileData = fs
            .readFileSync(currentWorkingDirectory + 'todo.txt')
            .toString();

        data = fileData.split('\n');

        // Filter the data for any empty lines
        let filterData = data.filter(function (value) {
            return value !== '';
        });

        // If delete index is greater than no. of task 
        // or less than zero
        const deleteIndex = parseInt(args[3]);
        if (isNaN(deleteIndex) || deleteIndex > filterData.length || deleteIndex <= 0) {
            console.log(
                'Error: todo #' + deleteIndex
                + ' does not exist. Nothing deleted.',
            );
        } else {

            // Remove the task
            filterData.splice(filterData.length - deleteIndex, 1);

            // Join the array to form a string
            const newData = filterData.join('\n');

            // Write the new data back in file
            fs.writeFile(
                currentWorkingDirectory + 'todo.txt',
                newData,
                function (err) {
                    if (err) throw err;

                    // Logs the deleted index
                    console.log('Deleted todo #' + deleteIndex);
                },
            );
        }
    } else {

        // Index argument was no passed
        console.log(
            'Error: Missing NUMBER for deleting todo.');
    }
};

const doneFunction = () => {

    // Store the index passed as argument
    const doneIndex = args[3];

    // If argument is passed
    if (doneIndex) {

        // Empty array
        let data = [];

        // Create a new date object
        let dateobj = new Date();

        // Convert it to string and slice only the
        // date part, removing the time part
        let dateString = dateobj.toISOString().substring(0, 10);

        // Read the data from todo.txt
        const fileData = fs
            .readFileSync(currentWorkingDirectory + 'todo.txt')
            .toString();

        // Read the data from done.txt
        const doneData = fs
            .readFileSync(currentWorkingDirectory + 'done.txt')
            .toString();

        // Split the todo.txt data
        data = fileData.split('\n');

        // Filter for any empty lines
        let filterData = data.filter(function (value) {
            return value !== '';
        });

        // If done index is greater than no. of task or <=0
        const doneIndex = parseInt(args[3]);
        if (isNaN(doneIndex) || doneIndex > filterData.length || doneIndex <= 0) {
            console.log('Error: todo #'
                + doneIndex + ' does not exist.');
        } else {

            // Delete the task from todo.txt
            // data and store it
            const deleted = filterData.splice(
                filterData.length - doneIndex, 1);

            // Join the array to create a string
            const newData = filterData.join('\n');

            // Write back the data in todo.txt
            fs.writeFile(
                currentWorkingDirectory + 'todo.txt',
                newData,
                function (err) {
                    if (err) throw err;
                },
            );

            // Write the stored task in done.txt
            // along with date string
            fs.writeFile(
                currentWorkingDirectory + 'done.txt',
                'x ' + dateString + ' ' + deleted
                + '\n' + doneData,
                function (err) {
                    if (err) throw err;
                    console.log('Marked todo #'
                        + doneIndex + ' as done.');
                },
            );
        }
    } else {

        // If argument was not passed
        console.log('Error: Missing NUMBER for'
            + ' marking todo as done.');
    }
};

const reportFunction = () => {

    // Create empty array for data of todo.txt
    let todoData = [];

    // Create empty array for data of done.txt
    let doneData = [];

    // Create a new date object
    let dateobj = new Date();

    // Slice the date part
    let dateString = dateobj.toISOString().substring(0, 10);

    // Read data from both the files
    const todo = fs.readFileSync(currentWorkingDirectory
        + 'todo.txt').toString();
    const done = fs.readFileSync(currentWorkingDirectory
        + 'done.txt').toString();

    // Split the data from both files
    todoData = todo.split('\n');

    doneData = done.split('\n');
    let filterTodoData = todoData.filter(function (value) {
        return value !== '';
    });

    let filterDoneData = doneData.filter(function (value) {

        // Filter both the data for empty lines
        return value !== '';
    });

    console.log(
        dateString +
        ' ' +
        'Pending : ' +
        filterTodoData.length +
        ' Completed : ' +
        filterDoneData.length,
        // Log the stats calculated
    );
};

switch (args[2]) {
    case 'add': {
        addFunction();
        break;
    }

    case 'ls': {
        listFunction();
        break;
    }

    case 'del': {
        deleteFunction();
        break;
    }

    case 'done': {
        doneFunction();
        break;
    }

    case 'help': {
        infoFunction();
        break;
    }

    case 'report': {
        reportFunction();
        break;
    }

    default: {
        infoFunction();
    }
}
