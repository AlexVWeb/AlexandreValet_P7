import React, {useState} from 'react'
export default function FileModal({modal, fileObject, messageFile}) {
    const [message, setMessage] = useState('')
    const [file, setFile] = useState(fileObject)

    const _onSubmit = (e) => {
        e.preventDefault()
        if (message !== '') {
            messageFile({message, file})
        } else {
            messageFile({file})
        }
        modal.hide()
    }

    return <>
        <div className="modal-body">
            <div className="file-previous">
                <img className="hide" src={URL.createObjectURL(file)} alt=""/>
            </div>
            <div className="file-name">{file.name}</div>

            <form onSubmit={_onSubmit} className="d-flex mt-2">
                <input onChange={(e) => setMessage(e.target.value)} type="text" className="form-control"
                       placeholder='Ajouter un commentaire'/>
                <button className="btn btn-primary mx-3 btn-submit" title="Envoyer">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
                         xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M13.7249 7.555L2.72494 2.055C2.63873 2.01189 2.54189 1.99461 2.44608 2.00526C2.35028 2.0159 2.25959 2.05401 2.18494 2.115C2.11365 2.17475 2.06045 2.2532 2.0313 2.34153C2.00215 2.42985 1.99822 2.52456 2.01994 2.615L3.34494 7.5H8.99994V8.5H3.34494L1.99994 13.37C1.97956 13.4455 1.97718 13.5248 1.99299 13.6014C2.00881 13.678 2.04239 13.7499 2.09102 13.8111C2.13965 13.8724 2.20199 13.9214 2.27301 13.9542C2.34403 13.987 2.42176 14.0027 2.49994 14C2.57821 13.9995 2.65528 13.9807 2.72494 13.945L13.7249 8.445C13.8068 8.40304 13.8756 8.3393 13.9236 8.26078C13.9716 8.18226 13.997 8.09203 13.997 8C13.997 7.90798 13.9716 7.81774 13.9236 7.73923C13.8756 7.66071 13.8068 7.59696 13.7249 7.555V7.555Z"
                            fill="currentColor"/>
                    </svg>
                </button>
            </form>
        </div>
    </>
}