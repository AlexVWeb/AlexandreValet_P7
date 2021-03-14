import React, {} from 'react'

export default function FileInput({modal, fileObject}) {
    const handleChange = (e) => {
        let newFile = e.target.files[0]
        openModal()
        fileObject(newFile)
    }

    const openModal = () => {
        modal.show()
    }

    return <>
        <div className="upload-btn-wrapper">
            <button type={"button"} className={"btn btn-info"}
                    title={"Pièce jointe"}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                     className="bi bi-paperclip" viewBox="0 0 16 16">
                    <path
                        d="M4.5 3a2.5 2.5 0 0 1 5 0v9a1.5 1.5 0 0 1-3 0V5a.5.5 0 0 1 1 0v7a.5.5 0 0 0 1 0V3a1.5 1.5 0 1 0-3 0v9a2.5 2.5 0 0 0 5 0V5a.5.5 0 0 1 1 0v7a3.5 3.5 0 1 1-7 0V3z"/>
                </svg>
            </button>
            <input onChange={handleChange} type="file" name="message_attachement"/>
        </div>
    </>
}