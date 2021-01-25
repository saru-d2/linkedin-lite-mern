import React, { Component } from 'react'
import axios from 'axios'
import Creatable from 'react-select/creatable';


const defaultLangs = [
    { label: "C", value: "C" }, { label: "C++", value: "C++" }, { label: "python", value: "python" }, { label: "java", value: "java" }
]

export default class AppEditProfile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            Loading: true,
            name: '',
            education: [],
            skills: [],
            applicant: {},
            errors: {},
        }
        this.onChangeEdu = this.onChangeEdu.bind(this);
        this.onAddEdu = this.onAddEdu.bind(this);
        this.onRemoveEdu = this.onRemoveEdu.bind(this);
        this.onChangeSkills = this.onChangeSkills.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

    }

    componentDidMount() {
        axios.post('http://localhost:5000/applicant/getApplicantUser').then(res => {
            this.setState({
                applicant: res.data
            });
            var skillTemp = []
            res.data.skills.map(skill => {
                skillTemp = [...skillTemp, { label: skill.lang, value: skill.lang }]
            })
            var eduArray = []
            res.data.education.map(edu => {
                eduArray = [...eduArray, { instiName: edu.instiName, startYear: edu.startYear, endYear: edu.endYear }]
            })
            this.setState({
                name: this.state.applicant.user.name,
                education: eduArray,
                skills: skillTemp,
                Loading: false,
            })
        })
    }

    onChangeSkills(value) {
        console.log(value)
        var skillList = []
        if (value)
            value.map((ob) => {
                skillList = [...skillList, { lang: ob.value }]
            })
        this.setState({ skills: value })
    }

    onChangeEdu(e, index) {
        const list = [...this.state.education];
        const { name, value } = e.target;
        list[index][name] = value;
        this.setState({ education: list })
    }

    onRemoveEdu(index) {
        const tempList = [...this.state.education];
        tempList.splice(index, 1);
        this.setState({ education: tempList });
    }

    onAddEdu() {
        this.setState({ education: [...this.state.education, { instiName: '', startYear: '', endYear: '' }] })
    }

    onSubmit() {
        var tempSkill = []
        this.state.skills.map((ob) => {
            tempSkill = [...tempSkill, { lang: ob.value }]
        })
        const subObject = {
            name: this.state.name,
            education: this.state.education,
            skills: tempSkill,
        }
        console.log(subObject)

        axios.post('http://localhost:5000/applicant/editUser', subObject).then(res => {
            console.log(res);
            window.location.replace('/')
        }).catch(err => {
            console.log(err);
            if (err.response)
                this.setState({
                    errors: err.response.data
                })
        })
    }

    render() {
        if (this.state.Loading)
            return (<h1>AppEditProfile</h1>)

        return (
            <div>
                <div className='form-group'>
                    <label>Name</label>
                    <input type='text' value={this.state.name} required id='name' onChange={this.onChangeName} />
                    <div className="text-danger">{this.state.errors.name}</div>
                </div>

                {
                    <div>
                        <label>skills required</label>
                        <Creatable value={this.state.skills} onChange={(value) => this.onChangeSkills(value)}
                            isMulti
                            options={defaultLangs}
                        />
                        <div className="text-danger">{this.state.errors.skills}</div>

                    </div>
                }
                <br /><br />
                {
                    this.state.education.map((ed, index) => {
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
                                {this.state.education.length !== 1 &&
                                    <button onClick={() => this.onRemoveEdu(index)}>Remove</button>}
                            </div>
                        )
                    })
                }
                {<button onClick={() => this.onAddEdu()}>Add</button>}
                <div className="text-danger">{this.state.errors.education}</div>

                <br />
                <br />

                <button onClick={this.onSubmit}> SUBMIT</button>


                {JSON.stringify(this.state.name)} <br />
                {JSON.stringify(this.state.skills)} <br />
                {JSON.stringify(this.state.education)} <br />
                {JSON.stringify(this.state.name)}
            </div>
        )
    }
}