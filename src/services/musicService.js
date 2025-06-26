const fetchBollywoodSongs = async () => {
  // Simulate API delay for realistic loading
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  try {
    const response = await import('../assets/songs.json');
    return response.default;
  } catch (error) {
    console.error('Error loading songs:', error);
    return [];
  }
};

export { fetchBollywoodSongs };