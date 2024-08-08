import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from '@mui/material';
import {useAuth} from "../context/AuthContext";

const AuthDialog = () => {
    const { authToken, saveAuthToken } = useAuth();
    const [token, setToken] = useState('');

    const handleSave = () => {
        saveAuthToken(token);
        window.location.reload();
    };

    return (
        <Dialog open={!authToken && !window.location.href.includes('iframe')} onClose={() => {}}>
            <DialogTitle>Введи токен</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Токен"
                    type="text"
                    fullWidth
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleSave} color="primary">
                    Войти
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AuthDialog;
