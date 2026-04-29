import React from 'react';
import styles from './Modal.module.css';

const Modal = ({ isOpen, title, message, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.modalBox}>
                <h2 className={styles.title}>{title}</h2>
                <p className={styles.message}>{message}</p>
                <div className={styles.btnGroup}>
                    <button className={styles.confirmBtn} onClick={onConfirm}>Confirm_Action</button>
                    <button className={styles.cancelBtn} onClick={onCancel}>Abort</button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
