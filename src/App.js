import React from 'react';
import './App.css';


let initialValue = [
  [3000, "Melbourne"],
  [3280, "Warnambool"],
  [3450, "Castlemaine"],
  [3350, "Ballarat"],
  [3220, "Geelong"],
  [3396, "Hopetoun"]
];

if (localStorage.getItem("arrPcodes")) {
  initialValue = JSON.parse(localStorage.getItem("arrPcodes"));
}

const checkArrayMatch = (array1, array2) => {
  let match = true;
  for (let i = 0; i < array1.length; i++) {
    if (array1[i] !== array2[i]) {
      match = false;
    }
  }

  return match;
}


class EntryListItem extends React.Component {
  constructor(props) {
    super(props);
    this.onClickDelete = this.onClickDelete.bind(this);
    this.onClickEdit = this.onClickEdit.bind(this);
  }

  onClickDelete() {
    this.props.deleteEntry(Number(this.props.index));
  }

  onClickEdit() {
    this.props.openEditDialogue(this.props.index);
  }

  render() {
    return (
      <li>
        <span className="entryListItem">
          <button type="button" onClick={this.onClickDelete}>&times;</button>
          {/* <input value={this.props.value[0]} />
          <input value={this.props.value[1]} /> */}
          <label>{this.props.value[0]}</label>
          <label>{this.props.value[1]}</label>
          <button type="button" onClick={this.onClickEdit}>Edit</button>
        </span>
      </li>
    )
  }
}


class EntryAddForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tempPcodeValue: "",
      tempTownNameValue: ""
    }

    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleClick() {
    let newPcodeValue = this.state.tempPcodeValue.trim();
    let newTownNameValue = this.state.tempTownNameValue.trim();

    if (newPcodeValue.length > 3 && newTownNameValue.length > 0) {
      this.props.addEntry(Number(newPcodeValue), newTownNameValue);
    } else {
      if (newPcodeValue.length < 4) {
        this.props.setErrorMessage("The postcode needs to be 4 digits long")
      } else if (newTownNameValue.length === 0) {
        this.props.setErrorMessage("The town/suburb name cannot be empty")
      }
    }
  }

  handleChange(event) {
    let target = event.target;
    let name = target.name;
    let value = target.value;

    if (name === "tempPcodeValue") {
      if ((/^[0-9]+$/.test(value) && value.length < 5) || value === "") {
        this.setState({
          [name]: value
        })
      }
    } else if (name === "tempTownNameValue") {
      if (/^[a-zA-Z\s]+$/.test(value) || value === "") {
        this.setState({
          [name]: value
        })
      }
    }
  }

  render() {
    return (
      <span>
        <input type="number" name="tempPcodeValue" value={this.state.tempPcodeValue} placeholder="Enter postcode here" onChange={this.handleChange} />
        <input type="text" name="tempTownNameValue" value={this.state.tempTownNameValue} placeholder="Enter town/suburb name here" onChange={this.handleChange} />
        <button onClick={this.handleClick} >Add</button>
      </span>
    )
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state= {
      arrPcodes: initialValue,
      errMessage: "",
      editMode: false,
      editIndex: undefined,
      editPcodeValue: undefined,
      editTownNameValue: undefined,
    };

    this.addEntry = this.addEntry.bind(this);
    this.editEntry = this.editEntry.bind(this);
    this.deleteEntry = this.deleteEntry.bind(this);
    this.setErrorMessage = this.setErrorMessage.bind(this);
    this.openEditDialogue = this.openEditDialogue.bind(this);
    this.onClickEditCancel = this.onClickEditCancel.bind(this);
    this.handleEditChange = this.handleEditChange.bind(this);
    this.updateStorage = this.updateStorage.bind(this);

    this.entryAddForm = React.createRef();
  }

  editEntry(event) {
    event.preventDefault();
    let editedEntry = [Number(this.state.editPcodeValue), this.state.editTownNameValue]
    let arrPcodes = this.state.arrPcodes;
    
    if (arrPcodes.some((entry) => checkArrayMatch(editedEntry, entry))) {
      if (checkArrayMatch(editedEntry, this.state.arrPcodes[this.state.editIndex])) {
        this.onClickEditCancel();
      } else {
        this.setErrorMessage("The edited entry you're trying to save already exists")
      }
    } else {
      arrPcodes[this.state.editIndex] = editedEntry;
      this.setState({
        arrPcodes: arrPcodes,
      })
      this.onClickEditCancel();
    }
  }

  deleteEntry(index) {
    let arrPcodes = this.state.arrPcodes;
    let removed = arrPcodes.splice(index, 1);

    this.setState({
      arrPcodes: arrPcodes
    });
  }

  addEntry(pCodeValue, townNameValue) {
    let newEntry = [pCodeValue, townNameValue];
    let arrPcodes = this.state.arrPcodes;

    if (arrPcodes.some((entry) => checkArrayMatch(newEntry, entry))) {
      this.setState({
        errMessage: "This entry already exists"
      })
    } else {
      arrPcodes.unshift(newEntry);
      this.setState({
        arrPcodes: arrPcodes,
        errMessage: ""
      });

      this.entryAddForm.current.setState({
        tempPcodeValue: "",
        tempTownNameValue: ""
      })
    }
  }

  openEditDialogue(index) {
    this.setState({
      editMode: true,
      editIndex: index,
      editPcodeValue: this.state.arrPcodes[index][0],
      editTownNameValue: this.state.arrPcodes[index][1]
    })
  }

  onClickEditCancel() {
    this.setState({
      editMode: false,
      editIndex: undefined,
      editPcodeValue: undefined,
      editTownNameValue: undefined
    })
  }

  handleEditChange(event) {
    let target = event.target;
    let name = target.name;
    let value = target.value;

    if (name === "editPcodeValue") {
      if ((/^[0-9]+$/.test(value) && value.length < 5) || value === "") {
        this.setState({
          [name]: value
        })
      }
    } else if (name === "editTownNameValue") {
      if (/^[a-zA-Z\s]+$/.test(value) || value === "") {
        this.setState({
          [name]: value
        })
      }
    }
  }

  setErrorMessage(message) {
    this.setState({
      errMessage: message
    })
  }

  updateStorage() {
    localStorage.setItem("arrPcodes", JSON.stringify(this.state.arrPcodes));
  }
  
  render() {
    return (
      <div className="App">
        <h1>Postcodes</h1>
        <EntryAddForm addEntry={this.addEntry} setErrorMessage={this.setErrorMessage} ref={this.entryAddForm}/>
        <p>{this.state.errMessage}</p>
        <ul>
          {this.state.arrPcodes.map((entry, index) => 
            <EntryListItem value={entry} key={index} index={index} deleteEntry={this.deleteEntry} openEditDialogue={this.openEditDialogue} />
          )}
        </ul>
        {this.state.editMode ? 
        <form id="edit-overlay" onSubmit={this.editEntry}>
          <h2>Edit entry</h2>
          <span>
            <input value={this.state.editPcodeValue} onChange={this.handleEditChange} name="editPcodeValue"/>
            <input value={this.state.editTownNameValue} onChange={this.handleEditChange} name="editTownNameValue" />
          </span>
          <span>
           <button type="submit">Save</button>
           <button onClick={this.onClickEditCancel}>Cancel</button>
          </span>
        </form>
        : ""}
        <button onClick={this.updateStorage}>Update HTML5 Local Storage</button>
      </div>
    );
  } 
}

export default App;
