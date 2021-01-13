import React, { Component, useState } from 'react';
import Creatable from 'react-select/creatable';
import '../../App.css'
const axios = require('axios');

const defaultLangs = [
    { label: "C", value: "C" }, { label: "C++", value: "C++" }, { label: "python", value: "python" }, { label: "java", value: "java" }
]


export default class ApplicantRegister extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: sessionStorage.getItem('userEmail'),
            eduList: [{ instiName: '', startYear: '', endYear: '' }],
            skills: []
        }
        this.onSubmit = this.onSubmit.bind(this);
        this.onChangeEdu = this.onChangeEdu.bind(this);
        this.onAddEdu = this.onAddEdu.bind(this);
        this.onRemoveEdu = this.onRemoveEdu.bind(this);
        this.onChangeSkills = this.onChangeSkills.bind(this);

    }



    onChangeEdu(e, index) {
        const list = [...this.state.eduList];
        const { name, value } = e.target;
        list[index][name] = value;
        this.setState({ eduList: list })
    }

    onRemoveEdu(index) {
        const tempList = [...this.state.eduList];
        tempList.splice(index, 1);
        this.setState({ eduList: tempList });
    }

    onAddEdu() {
        this.setState({ eduList: [...this.state.eduList, { instiName: '', startYear: '', endYear: '' }] })
    }

    onChangeSkills(value) {
        console.log(value);
        this.setState({ skills: value });
    }

    onSubmit() {
        console.log('submitted');
        var skillList = []
        this.state.skills.map((ob) => {
            skillList = [...skillList, {lang: ob.value}]
        })
        console.log(skillList);
    }


    render() {
        return (
            <div className='react'>
                <h2>register for applicant</h2>
                 list ur education pls:
                {
                    this.state.eduList.map((ed, index) => {
                        return (
                            <div key={index}>
                                <input name='instiName'
                                    onChange={(event) => this.onChangeEdu(event, index)}
                                    value={ed.instiName} placeholder='instiName' />

                                <input name='startYear'
                                    type='text'
                                    onChange={(event) => this.onChangeEdu(event, index)}
                                    value={ed.startYear} placeholder='startYear' />

                                <input name='endYear'
                                    onChange={(event) => this.onChangeEdu(event, index)}
                                    value={ed.endYear} placeholder='endYear' />
                                {this.state.eduList.length !== 1 &&
                                    <button onClick={() => this.onRemoveEdu(index)}>Remove</button>}
                            </div>
                        )
                    })
                }
                {<button onClick={() => this.onAddEdu()}>Add</button>}

                <div style={{ marginTop: 20 }}>{JSON.stringify(this.state.eduList)}</div>
                <br />
                <br />

                list ur skills pls:
                {
                    <div>
                        <label>skills</label>
                        <Creatable onChange={(value) => this.onChangeSkills(value)}
                            isMulti
                            options={defaultLangs}
                            value={this.state.skills}
                        />
                    </div>
                }

                <div style={{ marginTop: 20 }}>{JSON.stringify(this.state.skills)}</div>
                <button onClick={() =>{this.onSubmit()}} >submit</button>

            </div>
        )
    }

}