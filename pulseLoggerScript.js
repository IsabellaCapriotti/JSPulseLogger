//************************************** 
// GLOBAL DECLARATIONS
//************************************** 

// Selectors for add entry button and list of logs
const newEntryBtn = document.querySelector(".intro-btn");
const logList = document.querySelector(".log-container");


//Object to store current input data, array to hold all inputs
function currentInput(id="", date="")  {
    this.id = id; 
    this.date = date; 
    this.pulseEntries = [];
};

//Object to store a pulse entry
function pulseEntry(id="", pulseType = "", pulseValue =""){
    this.id = id; 
    this.pulseType = pulseType; 
    this.pulseValue = pulseValue;
}

//Array to store input data
let allInputs = []; 

//ID values
let id = 0;
let entryID = 0; 


//************************************** 
// INITIALIZE PAGE FROM LOCAL STORAGE
//************************************** 
window.addEventListener("DOMContentLoaded", ()=>{
    console.log(JSON.parse(localStorage.getItem("allInputs"))); 

    //If no local storage exists, initialize it
    if(JSON.parse(localStorage.getItem("allInputs") == null))
        localStorage.setItem("allInputs", JSON.stringify([])); 

    //If it does exist, set allInputs array to value stored 
    else{
        allInputs = JSON.parse(localStorage.getItem("allInputs")); 

        //Generate page content based on local storage
        generateContent(); 
    }

    console.log("initialized: "); 
    console.log(allInputs); 
});


//************************************** 
// INITIAL BUTTONS
//************************************** 


// Add entry button 
newEntryBtn.addEventListener( "click", addItem);

//Settings button

//Selectors for setting button and pop up
const settingsBtn = document.querySelector(".settings-btn"); 
const popUp = document.querySelector(".overlay"); 
const closeBtn = document.querySelector(".close-btn"); 
const clearBtn = document.querySelector(".clear-btn");

settingsBtn.addEventListener( "click", ()=>{
    popUp.classList.toggle("show"); 
});

closeBtn.addEventListener( "click", () =>{
    popUp.classList.toggle("show");
});

clearBtn.addEventListener( "click", ()=>{
    
    localStorage.removeItem("allInputs"); 
    allInputs = []; 
    window.location.reload(); 
});


//************************************** 
// ADD ITEM FUNCTION (AKA THE WHOLE FUNCTIONALITY OF THE PAGE)
//************************************** 
function addItem(){

    // ************************
    // DATE LOG

    //Show list of logs,if it was hidden
    if(!logList.classList.contains("show"))
        logList.classList.add("show"); 

    //Generate a new log form
    const newLog = document.createElement("article"); 
    newLog.classList.add("log");

    //Generate new ID
    let id = new Date().getTime(); 
    newLog.innerHTML = `<!--Info -->
    <div class="log-info"> 
        <h3 class="log-text" data-id="${id}"> Friday 6/19 </h3>
        <button class="log-btn">
            <i class="fa fa-ellipsis-h"></i>
        </button>
    </div>

    <!-- Form -->
    <form class="log-form">
        <input class="date-input" type="text" id="log-date" name="log-date" placeholder="Enter date to log: ">   
        <button type="submit" class="date-submit-btn">
            <i class="fa fa-check"></i>
        </button>
    </form>
    
    <!-- Entry -->
    <div class="entry-container">
    
        <!-- Form -->
        <form class="entry-form"> 
            <label for="entry-type"> Pulse type: </label>
            <select data-id="${id}" class="entry-select" name="entry-type" id="entry-type">
                <option value="Active"> Active </option>
                <option value="Light Active"> Light Active </option>
                <option value="Resting"> Resting </option> 
            </select>

            <label class="pulse-label" for="pulse-value"> Pulse: </label>
            <input data-id="${id}" type="text" class="pulse-input" name="pulse-value" id="pulse-value" placeholder = "BPM">
            <button type="submit" class="pulse-submit-btn">
                <i class="fa fa-check"></i>
            </button>
        </form>

    </div>`
    ;

    //Add to document
    logList.insertBefore(newLog, logList.childNodes[0]);

    //Select form and text entry from newly created log item
    const dateForm = newLog.querySelector(".log-form"); 
    const dateFormData = newLog.querySelector("#log-date");

    //Select log info and log text from newly created log item
    const logInfo = newLog.querySelector(".log-info"); 
    const logText = newLog.querySelector(".log-text"); 
    

    //Event listener for date form submission 
    dateForm.addEventListener("submit", (event) =>{

        event.preventDefault(); 

        //Get entered value
        const enteredDate = dateFormData.value;
        
        //Replace form with info data
        logText.textContent = enteredDate; 
        dateForm.style.display =  "none"; 
        logInfo.classList.add("show"); 

        //Add new log to memory 
        allInputs.push(new currentInput(id, enteredDate));
        updateLocalStorage(allInputs); 
        console.log("after adding log item: "); 
        console.log(allInputs);  

    });

    //Select expand button from newly created log item
    const expandBtn = newLog.querySelector(".log-btn");

    //Select entry info container
    const entryContainer = newLog.querySelector(".entry-container"); 

    //Event listener for expand button 
    expandBtn.addEventListener("click", ()=>{

        //Toggle between showing and hiding entry info 
        entryContainer.classList.toggle("show"); 

    });


    // *********************
    // PULSE ENTRY 
    
    //Get form and form data from newly created entry 
    const pulseForm = newLog.querySelector(".entry-form"); 
    const pulseTypeFormData = newLog.querySelector(".entry-select"); 
    const pulseFormData = newLog.querySelector(".pulse-input"); 


    //Event listener for form submission
    pulseForm.addEventListener("submit", ()=>{
        event.preventDefault(); 

        //Get value of pulse type and pulse 
        const pulseType = pulseTypeFormData.value; 
        const pulseValue = pulseFormData.value; 

        //Generate new id for entry item 
        entryID = new Date().getTime(); 
      
        // Generate entry item to display 
        let newEntry = document.createElement("div"); 
        newEntry.classList.add("entry-item"); 
        newEntry.innerHTML = `
        <p class="current-entry" data-id="${entryID}"> ${pulseType}: ${pulseValue} </p>
        <button class="remove-btn"> 
            <i class="fa fa-times"></i>
        </button>`
        ;


        //Select newly created entry to get ID
        const currentEntry = newEntry.querySelector(".current-entry"); 

        //Add new entry to entry container and entries array
        entryContainer.insertBefore(newEntry, entryContainer.children[0]);

        //Add entry data to input item of matching id
        allInputs = allInputs.map( (item)=>{

            if(item.id == pulseFormData.dataset.id){
                item.pulseEntries.push( new pulseEntry(entryID, pulseType, pulseValue)); 
            }
            
            return item;
        });

        //Update local storage
        updateLocalStorage(allInputs); 

        console.log("after adding pulse entry: "); 
        console.log(allInputs);

        //Clear forms
        pulseTypeFormData.value = ""; 
        pulseFormData.value = ""; 


        //Select delete button
        const deleteBtn = newEntry.querySelector(".remove-btn"); 

        //Event listener for delete button 
        deleteBtn.addEventListener("click", ()=>{

            //Remove item from page
            newEntry.innerHTML = "";
           
            //Remove item from memory 
            allInputs = allInputs.map( (item)=>{

                //Locate current log item 
                if(item.id == pulseFormData.dataset.id){
                    
                    //Iterate through that items entries, remove the entry that matches the current ID 
                    item.pulseEntries = item.pulseEntries.filter( (item) =>{

                        if(item.id == currentEntry.dataset.id){
                            return !(item.pulseValue == pulseValue && item.pulseType == pulseType); 
                        }

                        else
                            return item; 
                    });

                }

                return item; 
            });
            
            //Update local storage
            updateLocalStorage(allInputs); 

            console.log("after removal: ");
            console.log(allInputs); 
        });

    });

}


// LOCAL STORAGE 
function updateLocalStorage(allInputs){

    localStorage.setItem("allInputs", JSON.stringify(allInputs)); 
    console.log("new storage: "); 
    console.log(JSON.parse(localStorage.getItem("allInputs"))); 
}

function generateContent(){

    //Iterate through allInputs, generating content to display from each item 
    for(let i in allInputs){
        let id = allInputs[i].id;
        let date = allInputs[i].date;
        let pulseEntries = allInputs[i].pulseEntries; 

        // ************************
        // DATE LOG

        //Show list of logs,if it was hidden
        if(!logList.classList.contains("show"))
        logList.classList.add("show"); 

        //Generate a new log form
        const newLog = document.createElement("article"); 
        newLog.classList.add("log");

        newLog.innerHTML = `<!--Info -->
        <div class="log-info show"> 
            <h3 class="log-text" data-id="${id}"> ${date} </h3>
            <button class="log-btn">
                <i class="fa fa-ellipsis-h"></i>
            </button>
        </div>

        <!-- Entry -->
        <div class="entry-container">

            <!-- Form -->
            <form class="entry-form"> 
                <label for="entry-type"> Pulse type: </label>
                <select data-id="${id}" class="entry-select" name="entry-type" id="entry-type">
                    <option value="Active"> Active </option>
                    <option value="Light Active"> Light Active </option>
                    <option value="Resting"> Resting </option> 
                </select>

                <label class="pulse-label" for="pulse-value"> Pulse: </label>
                <input data-id="${id}" type="text" class="pulse-input" name="pulse-value" id="pulse-value" placeholder = "BPM">
                <button type="submit" class="pulse-submit-btn">
                    <i class="fa fa-check"></i>
                </button>
            </form>

        </div>`
        ;

        //Add to document
        logList.insertBefore(newLog, logList.childNodes[0]);
    

        //Select expand button from newly created log item
        const expandBtn = newLog.querySelector(".log-btn");

        //Select entry info container
        const entryContainer = newLog.querySelector(".entry-container"); 

        //Event listener for expand button 
        expandBtn.addEventListener("click", ()=>{

            //Toggle between showing and hiding entry info 
            entryContainer.classList.toggle("show"); 

        });


        // *********************
        // PULSE ENTRY 

        //Add existing items
        for(let j in pulseEntries){
            //Select values from storage
            const pulseValue = pulseEntries[j].pulseValue;
            const pulseType = pulseEntries[j].pulseType; 
            const entryID = pulseEntries[j].id; 

            //Add entry 
            let newEntry = document.createElement("div"); 
            newEntry.classList.add("entry-item"); 
            newEntry.innerHTML = `
            <p class="current-entry" data-id="${entryID}"> ${pulseType}: ${pulseValue} </p>
            <button class="remove-btn"> 
                <i class="fa fa-times"></i>
            </button>`
            ;

            entryContainer.insertBefore(newEntry, entryContainer.children[0]);

            //Select delete button
            const deleteBtn = newEntry.querySelector(".remove-btn"); 

            //Event listener for delete button 
            deleteBtn.addEventListener("click", ()=>{

                //Remove item from page
                newEntry.innerHTML = "";
            
                //Remove item from memory 
                allInputs = allInputs.map( (item)=>{

                    //Locate current log item 
                    if(item.id == id){
                        
                        //Iterate through that items entries, remove the entry that matches the current ID 
                        item.pulseEntries = item.pulseEntries.filter( (item) =>{

                            if(item.id == entryID){
                                return !(item.pulseValue == pulseValue && item.pulseType == pulseType); 
                            }

                            else
                                return item; 
                        });

                    }

                    return item; 
                });
                
                //Update local storage
                updateLocalStorage(allInputs); 

                console.log("after removal: ");
                console.log(allInputs); 
            });

        }
        
        //Leave opportunity to add new items
        //Get form and form data from newly created entry 
        const pulseForm = newLog.querySelector(".entry-form"); 
        const pulseTypeFormData = newLog.querySelector(".entry-select"); 
        const pulseFormData = newLog.querySelector(".pulse-input"); 


        //Event listener for form submission
        pulseForm.addEventListener("submit", ()=>{
            event.preventDefault(); 

            //Get value of pulse type and pulse 
            const pulseType = pulseTypeFormData.value; 
            const pulseValue = pulseFormData.value; 

            //Generate new id for entry item 
            entryID = new Date().getTime(); 
        
            // Generate entry item to display 
            let newEntry = document.createElement("div"); 
            newEntry.classList.add("entry-item"); 
            newEntry.innerHTML = `
            <p class="current-entry" data-id="${entryID}"> ${pulseType}: ${pulseValue} </p>
            <button class="remove-btn"> 
                <i class="fa fa-times"></i>
            </button>`
            ;


            //Select newly created entry to get ID
            const currentEntry = newEntry.querySelector(".current-entry"); 

            //Add new entry to entry container
            entryContainer.insertBefore(newEntry, entryContainer.children[0]);

            //Add entry data to input item of matching id
            allInputs = allInputs.map( (item)=>{

                if(item.id == pulseFormData.dataset.id){
                    item.pulseEntries.push( new pulseEntry(entryID, pulseType, pulseValue)); 
                }
                
                return item;
            });

            //Update local storage
            updateLocalStorage(allInputs); 

            console.log("after adding pulse entry: "); 
            console.log(allInputs);

            //Clear forms
            pulseTypeFormData.value = ""; 
            pulseFormData.value = ""; 


            //Select delete button
            const deleteBtn = newEntry.querySelector(".remove-btn"); 

            //Event listener for delete button 
            deleteBtn.addEventListener("click", ()=>{

                //Remove item from page
                newEntry.innerHTML = "";
            
                //Remove item from memory 
                allInputs = allInputs.map( (item)=>{

                    //Locate current log item 
                    if(item.id == pulseFormData.dataset.id){
                        
                        //Iterate through that items entries, remove the entry that matches the current ID 
                        item.pulseEntries = item.pulseEntries.filter( (item) =>{

                            if(item.id == currentEntry.dataset.id){
                                return !(item.pulseValue == pulseValue && item.pulseType == pulseType); 
                            }

                            else
                                return item; 
                        });

                    }

                    return item; 
                });
                
                //Update local storage
                updateLocalStorage(allInputs); 

                console.log("after removal: ");
                console.log(allInputs); 
            });

        });

    }
    


}

