import React, { useState } from 'react'
import { hotelApi } from '../../../Features/hotels/hotelAPI'
import * as yup from 'yup';

type HotelFields = {
    name: string;
    location: string;
    address: string;
    contact_number: string;
    category: string;
    img_url: string;
    description: string;
    rating: number;
}

interface AddHotelProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

const schema = yup.object({
    name: yup.string().required('Hotel name is required'),
    location: yup.string().required('Location is required'),
    address: yup.string().required('Address is required'),
    contact_number: yup.string().required('Contact number is required'),
    category: yup.string().required('Category is required'),
    img_url: yup.string(), // Optional since we now upload files
    description: yup.string().required('Description is required'),
    rating: yup.number().min(0, 'Rating must be at least 0').max(5, 'Rating cannot exceed 5').required('Rating is required'),
});

const AddHotel: React.FC<AddHotelProps> = ({ isOpen, onClose, onSuccess }) => {
    const [hotelFormData, setHotelFormData] = useState<HotelFields>({
        name: '',
        location: '',
        address: '',
        contact_number: '',
        category: '',
        img_url: '',
        description: '',
        rating: 0
    });

    const [errors, setErrors] = useState<Partial<Record<keyof HotelFields, string>>>({});
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    
    const [createHotel, { isLoading }] = hotelApi.useCreateHotelMutation();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setHotelFormData(prev => ({
            ...prev,
            [name]: name === 'rating' ? Number(value) : value
        }));
        
        // Clear error when user starts typing
        if (errors[name as keyof HotelFields]) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined
            }));
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedImage(file);
            
            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };


    const validateForm = async () => {
        try {
            await schema.validate(hotelFormData, { abortEarly: false });
            setErrors({});
            return true;
        } catch (error) {
            if (error instanceof yup.ValidationError) {
                const validationErrors: Partial<Record<keyof HotelFields, string>> = {};
                error.inner.forEach(err => {
                    if (err.path) {
                        validationErrors[err.path as keyof HotelFields] = err.message;
                    }
                });
                setErrors(validationErrors);
            }
            return false;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const isValid = await validateForm();
        if (!isValid) return;

        try {
            // Create FormData for multipart/form-data submission
            const formData = new FormData();
            
            // Append all hotel data to FormData
            formData.append('name', hotelFormData.name);
            formData.append('location', hotelFormData.location);
            formData.append('address', hotelFormData.address);
            formData.append('contact_number', hotelFormData.contact_number);
            formData.append('category', hotelFormData.category);
            formData.append('description', hotelFormData.description);
            formData.append('rating', hotelFormData.rating.toString());
            
            // Append image if selected
            if (selectedImage) {
                formData.append('image', selectedImage);
            }

            await createHotel(formData).unwrap();
            alert('Hotel created successfully!');
            resetForm();
            onClose();
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error('Failed to create hotel:', error);
            alert('Failed to create hotel. Please try again.');
        }
    };

    const resetForm = () => {
        setHotelFormData({
            name: '',
            location: '',
            address: '',
            contact_number: '',
            category: '',
            img_url: '',
            description: '',
            rating: 0
        });
        setErrors({});
        setSelectedImage(null);
        setImagePreview(null);
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-10 mx-auto p-5 border max-w-2xl shadow-lg rounded-md bg-white">
                <div className="mt-3">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Add New Hotel
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Hotel Name</label>
                            <input
                                type="text"
                                name="name"
                                value={hotelFormData.name}
                                onChange={handleInputChange}
                                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                                    errors.name ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Enter hotel name"
                            />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Location</label>
                            <input
                                type="text"
                                name="location"
                                value={hotelFormData.location}
                                onChange={handleInputChange}
                                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                                    errors.location ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Enter location"
                            />
                            {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Address</label>
                            <input
                                type="text"
                                name="address"
                                value={hotelFormData.address}
                                onChange={handleInputChange}
                                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                                    errors.address ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Enter full address"
                            />
                            {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Contact Number</label>
                            <input
                                type="text"
                                name="contact_number"
                                value={hotelFormData.contact_number}
                                onChange={handleInputChange}
                                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                                    errors.contact_number ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Enter contact number"
                            />
                            {errors.contact_number && <p className="text-red-500 text-xs mt-1">{errors.contact_number}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Category</label>
                            <select
                                name="category"
                                value={hotelFormData.category}
                                onChange={handleInputChange}
                                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                                    errors.category ? 'border-red-500' : 'border-gray-300'
                                }`}
                            >
                                <option value="">Select Category</option>
                                <option value="budget">Budget</option>
                                <option value="mid-range">Mid-range</option>
                                <option value="luxury">Luxury</option>
                                <option value="boutique">Boutique</option>
                                <option value="resort">Resort</option>
                            </select>
                            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Hotel Image</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            {imagePreview && (
                                <div className="mt-2">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-32 h-24 object-cover rounded border"
                                    />
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea
                                name="description"
                                value={hotelFormData.description}
                                onChange={handleInputChange}
                                rows={3}
                                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                                    errors.description ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Enter hotel description"
                            />
                            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Rating</label>
                            <input
                                type="number"
                                name="rating"
                                value={hotelFormData.rating}
                                onChange={handleInputChange}
                                min="0"
                                max="5"
                                step="0.1"
                                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                                    errors.rating ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="0.0"
                            />
                            {errors.rating && <p className="text-red-500 text-xs mt-1">{errors.rating}</p>}
                        </div>

                        <div className="flex items-center justify-end space-x-3 pt-4">
                            <button
                                type="button"
                                onClick={handleClose}
                                disabled={isLoading}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                            >
                                {isLoading ? 'Creating...' : 'Create Hotel'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddHotel
