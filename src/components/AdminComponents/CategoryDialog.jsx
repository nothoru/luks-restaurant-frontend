// src/components/AdminComponents/CategoryDialog.jsx
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Paper,
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import axiosInstance from '../../api/axiosInstance';

const CategoryDialog = ({ open, onClose, onSuccess }) => {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');

  const fetchCategories = async () => {
    try {
      const res = await axiosInstance.get('/api/menu/categories/');
      setCategories(res.data);
    } catch (error) {
      console.error("Failed to fetch categories", error);
    }
  };

  useEffect(() => {
    if (open) {
      fetchCategories();
    }
  }, [open]);

  const handleCategorySave = async () => {
    if (!newCategoryName.trim()) return;
    try {
      const response = await axiosInstance.post('/api/menu/admin/categories/', { name: newCategoryName });
      const newCategory = response.data;
      setNewCategoryName('');
      fetchCategories(); // Refresh the list
      onSuccess(newCategory); // Pass the new category back to the parent
    } catch (err) {
      alert('Error saving category.');
    }
  };

  const handleCategoryDelete = async (categoryId) => {
    if (window.confirm('Are you sure? This cannot be undone.')) {
      try {
        await axiosInstance.delete(`/api/menu/admin/categories/${categoryId}/`);
        fetchCategories(); // Refresh the list
      } catch (err) {
        alert('Error deleting category: ' + (err.response?.data?.error || "Check if it's in use."));
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Manage Categories</DialogTitle>
      <DialogContent>
        <Typography variant="h6" gutterBottom>Add New Category</Typography>
        <Box component="form" display="flex" gap={1} alignItems="center" onSubmit={(e) => { e.preventDefault(); handleCategorySave(); }}>
          <TextField autoFocus label="New Category Name" fullWidth size="small" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} />
          <Button type="submit" variant="contained">Add</Button>
        </Box>
        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Existing Categories</Typography>
        <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 200 }}>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.map((cat) => (
                <TableRow key={cat.id}>
                  <TableCell>{cat.name}</TableCell>
                  <TableCell align="right"><IconButton color="error" size="small" onClick={() => handleCategoryDelete(cat.id)}><Delete /></IconButton></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CategoryDialog;