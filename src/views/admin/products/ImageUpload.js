import React, { Component } from 'react';
import './imageUpload.css';
import {updateImage} from "../../_redux_/productsSlice"
export class ImageUpload extends Component {
    state = {
        profileImg: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
    }
    imageHandler = (e) => {
        const reader = new FileReader();
        reader.onload = () => {
            if (reader.readyState === 2) {
                this.setState({ profileImg: reader.result })
            }
        }
        reader.readAsDataURL(e.target.files[0])
    };
    render() {
        const { profileImg } = this.state
        return (
                <div >
                    <div className="img-holder">
                        <img src={profileImg} alt="" id="img" className="img" />
                    </div>
                    <input type="file" accept="image/*" name="image-upload" id="input" onChange={this.imageHandler} />
                    <div className="label">
                        
                        <label className="image-upload" htmlFor="input">
                            <i className="material-icons">add_photo_alternate</i>
						Thêm ảnh 
					</label>
                    </div>
                    </div>
        
        );
    }
}

export default ImageUpload;