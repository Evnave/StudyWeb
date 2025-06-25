# Study Web - Your Learning Companion

A clean, modern web application designed for students to take notes, create flashcards, and take quizzes. Built with vanilla HTML, CSS, and JavaScript, featuring a beautiful design with baby pink and soft blue color scheme.

## Features

### 📝 Notes Tab
- **Rich Text Editor**: Write and format your notes with bold, italic, and underline options
- **Text Highlighting**: Highlight important text in yellow or red
- **Note Organization**: Create multiple notes with automatic saving
- **Search Functionality**: Quickly find notes by searching through titles and content
- **Real-time Saving**: Your notes are automatically saved as you type

### 🃏 Flashcard Tab
- **Interactive Cards**: Click to flip between term and definition
- **Navigation Controls**: Use arrow buttons to navigate between cards
- **Card Creation**: Easily add new flashcards with terms and definitions
- **Shuffle Feature**: Randomize card order for better studying
- **Progress Tracking**: See which card you're currently viewing

### ❓ Quiz Tab
- **Quiz Creation**: Create multiple-choice questions with 4 answer options
- **Quiz Taking**: Take quizzes with progress tracking
- **Results Analysis**: Get detailed results showing correct and incorrect answers
- **Score Calculation**: See your percentage score after completing a quiz
- **Retake Option**: Retake quizzes to improve your score

## Design Features

- **Fluent Design**: Modern UI with depth effects, smooth animations, and contextual controls
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile devices
- **Color Scheme**: Beautiful gradient backgrounds using white, baby pink, and soft blue
- **Accessibility**: High contrast text and intuitive navigation
- **Touch-Friendly**: Optimized for touch devices with appropriate button sizes

## How to Use

### Getting Started
1. Open `index.html` in your web browser
2. The application will load with sample data to demonstrate features
3. Start exploring the three main tabs: Notes, Flashcard, and Quiz

### Notes
1. Click "New Note" to create a new note
2. Type your content in the editor
3. Use the toolbar to format text (bold, italic, underline)
4. Select text and use the highlighter to mark important information
5. Your notes are automatically saved

### Flashcards
1. Enter a term and definition in the creation panel
2. Click "Create Card" to add it to your deck
3. Use the navigation arrows to move between cards
4. Click the card or "Flip Card" button to see the definition
5. Use "Shuffle" to randomize the card order

### Quiz
1. **Creating a Quiz**:
   - Click "New Quiz" to create questions
   - Enter your question and four answer options
   - Select the correct answer using the radio buttons
   - Click "Add Question" to save the question
   
2. **Taking a Quiz**:
   - Click "Take Quiz" to start
   - Answer each question by clicking on an option
   - Use "Previous" and "Next" to navigate
   - Click "Submit Quiz" on the last question to see results

## Technical Details

### Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Requires JavaScript enabled
- Uses localStorage for data persistence

### Data Storage
- All data is stored locally in your browser using localStorage
- No internet connection required
- Data persists between browser sessions

### File Structure
```
study-web/
├── index.html          # Main HTML file
├── styles.css          # CSS styles and responsive design
├── script.js           # JavaScript functionality
├── requirements.md     # Detailed requirements document
└── README.md          # This file
```

## Customization

### Colors
The color scheme can be customized by modifying the CSS variables in `styles.css`:

```css
:root {
    --primary-white: #FFFFFF;
    --baby-pink: #FFE5F1;
    --soft-blue: #E8F4FD;
    --accent-pink: #FFB6C1;
    --accent-blue: #87CEEB;
    /* ... more variables */
}
```

### Adding Features
The modular JavaScript structure makes it easy to add new features:
- Add new tabs by extending the `StudyWebApp` class
- Implement new data types by adding storage methods
- Customize the UI by modifying the CSS classes

## Mobile Experience

The application is fully responsive and optimized for mobile devices:
- Sidebar collapses to a horizontal tab bar on mobile
- Touch-friendly buttons and controls
- Optimized layouts for smaller screens
- Smooth animations that work well on mobile

## Future Enhancements

Potential features that could be added:
- Export/import functionality for notes and flashcards
- Cloud synchronization
- Multiple quiz categories
- Study statistics and progress tracking
- Dark mode theme
- Collaborative features

## Browser Support

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+

## License

This project is open source and available under the MIT License.

---

**Happy Studying! 📚✨**

Built with ❤️ for students everywhere. 