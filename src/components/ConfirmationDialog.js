import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';

const ConfirmationDialog = ({ open, handleClose, handleConfirm, title, content }) => {
    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText>{content}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Отменить</Button>
                <Button onClick={handleConfirm} color="primary">Подтвердить</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmationDialog;
