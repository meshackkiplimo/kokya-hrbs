import React, { useState } from 'react';
import { useCreateRoomMutation } from '../../../Features/rooms/roomsAPI';

interface CreateRoomProps {
    selectedHotel: {
        hotel_id: number;
        name: string;
    } | null;
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

const CreateRoom: React.FC<CreateRoomProps> = ({ selectedHotel, isOpen, onClose, onSuccess }) => {
    const [roomFormData, setRoomFormData] = useState({
        hotel_id: selectedHotel?.hotel_id || 0,
        room_type: '',
        room_number: '',
        capacity: 1,
        price_per_night: 0,
        amenities: '',
        availability: 'available',
        img_url: '',
        description: ''
    });

    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);

    const [createRoom, { isLoading }] = useCreateRoomMutation();

    // Update hotel_id when selectedHotel changes
    React.useEffect(() => {
        if (selectedHotel) {
            setRoomFormData(prev => ({
                ...prev,
                hotel_id: selectedHotel.hotel_id
            }));
        }
    }, [selectedHotel]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setRoomFormData(prev => ({
            ...prev,
            [name]: name === 'capacity' || name === 'price_per_night' || name === 'hotel_id' ? Number(value) : value
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        
        // Validate number of files (2-3 images)
        if (files.length < 2 || files.length > 3) {
            alert('Please select 2-3 images');
            return;
        }
        
        setSelectedImages(files);
        
        // Create previews for all selected images
        const previews: string[] = [];
        let loadedCount = 0;
        
        files.forEach((file, index) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                previews[index] = e.target?.result as string;
                loadedCount++;
                
                // Update state when all images are loaded
                if (loadedCount === files.length) {
                    setImagePreviews([...previews]);
                }
            };
            reader.readAsDataURL(file);
        });
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Create FormData for multipart/form-data submission
            const formData = new FormData();
            
            // Append all room data to FormData
            formData.append('hotel_id', roomFormData.hotel_id.toString());
            formData.append('room_type', roomFormData.room_type);
            formData.append('room_number', roomFormData.room_number);
            formData.append('capacity', roomFormData.capacity.toString());
            formData.append('price_per_night', roomFormData.price_per_night.toString());
            formData.append('amenities', roomFormData.amenities);
            formData.append('availability', roomFormData.availability);
            formData.append('description', roomFormData.description);
            
            // Append multiple images if selected
            if (selectedImages.length > 0) {
                selectedImages.forEach((image) => {
                    formData.append('images', image);
                });
            }

            await createRoom(formData).unwrap();
            alert('Room added successfully!');
            resetForm();
            onClose();
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error('Failed to create room:', error);
            alert('Failed to add room. Please try again.');
        }
    };

    const resetForm = () => {
        setRoomFormData({
            hotel_id: selectedHotel?.hotel_id || 0,
            room_type: '',
            room_number: '',
            capacity: 1,
            price_per_night: 0,
            amenities: '',
            availability: 'available',
            img_url: '',
            description: ''
        });
        setSelectedImages([]);
        setImagePreviews([]);
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <div className="mt-3">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Add Room to {selectedHotel?.name}
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Hotel ID</label>
                            <input
                                type="number"
                                name="hotel_id"
                                value={roomFormData.hotel_id}
                                readOnly
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Room Type</label>
                            <select
                                name="room_type"
                                value={roomFormData.room_type}
                                onChange={handleInputChange}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="">Select Room Type</option>
                                <option value="single">Single</option>
                                <option value="double">Double</option>
                                <option value="suite">Suite</option>
                                <option value="family">Family</option>
                                <option value="deluxe">Deluxe</option>
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Room Number</label>
                            <input
                                type="text"
                                name="room_number"
                                value={roomFormData.room_number}
                                onChange={handleInputChange}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="e.g., 101, A-204"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Capacity</label>
                            <input
                                type="number"
                                name="capacity"
                                value={roomFormData.capacity}
                                onChange={handleInputChange}
                                min="1"
                                max="10"
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Price per Night</label>
                            <input
                                type="number"
                                name="price_per_night"
                                value={roomFormData.price_per_night}
                                onChange={handleInputChange}
                                min="0"
                                step="0.01"
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="0.00"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Amenities</label>
                            <input
                                type="text"
                                name="amenities"
                                value={roomFormData.amenities}
                                onChange={handleInputChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="WiFi, TV, AC, etc."
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Room Images (2-3 images required)</label>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageChange}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            {imagePreviews.length > 0 && (
                                <div className="mt-2 grid grid-cols-3 gap-2">
                                    {imagePreviews.map((preview, index) => (
                                        <img
                                            key={index}
                                            src={preview}
                                            alt={`Room Preview ${index + 1}`}
                                            className="w-24 h-18 object-cover rounded border"
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea
                                name="description"
                                value={roomFormData.description}
                                onChange={handleInputChange}
                                required
                                rows={3}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Describe the room features and details..."
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Availability</label>
                            <select
                                name="availability"
                                value={roomFormData.availability}
                                onChange={handleInputChange}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="available">Available</option>
                                <option value="occupied">Occupied</option>
                                <option value="maintenance">Maintenance</option>
                            </select>
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
                                {isLoading ? 'Adding...' : 'Add Room'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateRoom;