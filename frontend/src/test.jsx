import React, { Component } from 'react'
import axios from 'axios';

export default class Test extends Component {

    constructor(props) {
        super(props);
        this.state = {
            img: null,
            applicant: {},
            loading: true,
        }
        this.onChangeImage = this.onChangeImage.bind(this)
        this.onSubmit = this.onSubmit.bind(this)

    }

    componentDidMount() {
        axios.post('http://localhost:5000/applicant/getApplicantUser').then(res => {
            console.log(res)
            this.setState({
                loading: false,
                applicant: res.data
            })
        }).catch(err => console.log(err))
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
    }

    onSubmit() {
        console.log(this.state.img)
        axios.post('http://localhost:5000/applicant/addImg', { img: this.state.img }).then(res => {
            console.log(res);
        }).catch(err => {
            console.log(err);
        })
    }

    onReaderLoad = (readerEvt) => {
    }

    render() {

        function yes() {

        }

        var img = 'no image';
        if (this.state.applicant.img)
            img = <img src={this.state.applicant.img} className="mx-2 card-pic" width="100%" />
        if (this.state.loading)
            return (<h1>loading</h1>)
        if (!this.state.loading)
            return (
                <div>
                    <h1>TESTING API</h1>
                    <button onClick={yes} > TEST </button>
                    <div className="form-group row">
                        <label htmlFor="img" className="col-sm-2 col-form-label">Image</label>
                        <div className="col-sm-10">
                            <input type="file" className="form-control" id="img" required onChange={this.onChangeImage} />
                            {
                                // this.state.isError &&
                                // <p className="form-error">{this.state.errors.img}</p>
                            }
                        </div>
                        <button onClick={this.onSubmit}>submit</button>
                        {img}
                    </div>
                </div>
            )
    }
} 
