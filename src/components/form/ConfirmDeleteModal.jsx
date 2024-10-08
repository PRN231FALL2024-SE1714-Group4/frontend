import React from "react";
import { Modal } from "antd";

const ConfirmDeleteModal = ({ visible, onConfirm, onCancel }) => {
    return (
        <Modal
            title="Are you sure you want to delete this item?"
            open={visible}
            onOk={onConfirm}
            onCancel={onCancel}
            okText="Yes"
            okType="danger"
            cancelText="No"
        >
            <p>This action cannot be undone.</p>
        </Modal>
    );
};

export default ConfirmDeleteModal;
