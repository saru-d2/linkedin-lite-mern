import React, { Component, useState } from 'react';
import { render } from 'react-dom';
import Creatable from 'react-select/creatable';
import '../../App.css'
const axios = require('axios');

const defaultLangs = [
    { label: "C", value: "C" }, { label: "C++", value: "C++" }, { label: "python", value: "python" }, { label: "java", value: "java" }
]

class ApplicantRegister extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            eduList: [{ instiName: '', startYear: '', endYear: '' }],
            skills: [],
            errors: {},
            img: null,
            // resume: null,
        }
        this.onChangeEdu = this.onChangeEdu.bind(this);
        this.onAddEdu = this.onAddEdu.bind(this);
        this.onRemoveEdu = this.onRemoveEdu.bind(this);
        this.onChangeSkills = this.onChangeSkills.bind(this);
        this.onChangeImage = this.onChangeImage.bind(this);
        // this.onChangeResume = this.onChangeResume.bind(this);
        this.onSubmit = this.onSubmit.bind(this);


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

    onChangeImage(e) {
        e.preventDefault();
        let oldThis = this;
        let file = e.target.files[0];
        console.log(e.target.files[0]);
        if (file) {
            const reader = new FileReader();
            reader.onload = function (upload) {
                oldThis.setState({
                    img: upload.target.result
                })
            };

            reader.readAsDataURL(file);
        }

        console.log(this.state.img)
    }

    // onChangeResume(e) {
    //     var tempthis = this;
    //     var reader = new FileReader();
    //     reader.onload = function (uploadFile) {
    //         tempthis.setState({ resume: uploadFile.target.result })
    //     }
    //     reader.readAsDataURL(e.target.files[0]);
    // }

    onSubmit() {
        console.log(this.props.match.params.id)
        console.log('submitted');
        var skillList = []
        this.state.skills.map((ob) => {
            skillList = [...skillList, { lang: ob.value }]
        })
        console.log(skillList);
        const subObject = {
            email: this.props.match.params.id,
            education: this.state.eduList,
            skills: skillList,
            img: this.state.img,
            // resume: this.state.resume,
        }
        console.log(subObject)
        axios.post('http://localhost:5000/auth/register/applicant', subObject)
            .then(res => {
                alert("done! please continue to signin!");
                window.location.replace('http://localhost:3000/signin/');
            }).catch(
                err => {
                    console.log(err.response);
                    alert(`from backend: ${err}`);
                    if (err)
                        this.setState({ errors: err.response.data })
                    return;
                });
    }

    render() {
        return (
            <div className='react' style={{ marginLeft: '5%', marginRight: '5%' }}>
                <h2>register Applicant</h2>
                <div className='row'>
                    <div className='col-lg-2 col-form-labe'>
                        List education
                    </div>
                    <div className='col-lg-10'>
                        {
                            this.state.eduList.map((ed, index) => {
                                return (
                                    <div key={index} className='row'>
                                        <div className='col'>
                                            <input name='instiName' className='form-control'
                                                onChange={(event) => this.onChangeEdu(event, index)}
                                                value={ed.instiName} placeholder='instiName' />
                                        </div>
                                        <div className='col'>
                                            <input name='startYear'
                                                type='text' className='form-control'
                                                onChange={(event) => this.onChangeEdu(event, index)}
                                                value={ed.startYear} placeholder='startYear' />
                                        </div>
                                        <div className='col'>
                                            <input name='endYear' className='form-control'
                                                onChange={(event) => this.onChangeEdu(event, index)}
                                                value={ed.endYear} placeholder='endYear' />
                                        </div>
                                        {this.state.eduList.length !== 1 &&
                                            <button className='btn red shadow-move' onClick={() => this.onRemoveEdu(index)}>Remove</button>}
                                        <br />

                                        <br />
                                    </div>
                                )
                            })
                        }

                        {<button className='btn cyan shadow-move' onClick={() => this.onAddEdu()}>Add</button>}
                        <div className="text-danger">{this.state.errors.education}</div>
                    </div>
                </div>

                {/* <div style={{ marginTop: 20 }}>{JSON.stringify(this.state.eduList)}</div> */}
                <br />
                <br />

                list ur skills pls:
                {
                    <div className='row'>
                        <label className='col-lg-1'>skills</label>

                        <Creatable className='col-lg-7' onChange={(value) => this.onChangeSkills(value)}
                            isMulti
                            options={defaultLangs}
                            value={this.state.skills}
                        />
                    </div>
                }
                <div className="text-danger">{this.state.errors.skills}</div>
                <br />
                <br />

                <div className='form-group row'>
                    <label className='col-lg-2'>image</label>
                    <div className='col-lg-5'>
                        <input type='file' className="form-control"  required id='image' onChange={this.onChangeImage} />
                        <div className="text-danger">{this.state.errors.img}</div>
                    </div>
                </div>

                {/* <div className='form-group'>
                    <label>resume</label>
                    <input type='file' required id='resume' onChange={this.onChangeResume} />
                    <div className="text-danger">{this.state.errors.resume}</div>
                </div> */}

                <button className='btn red shadow-move' onClick={() => { this.onSubmit() }} >submit</button>
                {/* <div style={{ marginTop: 20 }}>{JSON.stringify(this.state.skills)}</div> <br />
                img: {this.state.img} */}
                {/* {this.state.resume} */}


            </div>

        )
    }
}

export default ApplicantRegister;