import React, {forwardRef} from "react";

export const Modal = forwardRef(({id, title, children}, ref) => {
    return <>
        <div className={"modal fade"} id={id} tabIndex="-1" aria-hidden="true" ref={ref}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    {
                        title && <>
                            <div className="modal-header">
                                <h5 className="modal-title">{title}</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal"
                                        aria-label="Close"></button>
                            </div>
                        </>
                    }
                    {children}
                </div>
            </div>
        </div>
    </>
})