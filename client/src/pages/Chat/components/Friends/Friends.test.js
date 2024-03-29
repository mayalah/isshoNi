import { render, screen, waitFor } from '@testing-library/react';
import Friends from './Friends'; 
import mockFriendsData from './mockFriendsData.json'; 

// Mock the global fetch function
beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockFriendsData),
    })
  );
});

// Restore mocks back to the original state after each test
afterEach(() => {
  jest.restoreAllMocks();
});

// Define the test
test('loads and displays friends', async () => {
  render(<Friends setSelectedFriend={() => {}} />);

  // Wait for the friends to be fetched and rendered
  await waitFor(() => {
    // Check that each friend's label is rendered in the document
    mockFriendsData.forEach(friend => {
      expect(screen.getByText(friend.label)).toBeInTheDocument();
    });
  });
});
