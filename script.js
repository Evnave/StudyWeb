// Study Web Application - Main JavaScript File

class StudyWebApp {
    constructor() {
        this.currentTab = 'notes';
        this.notes = this.loadNotes();
        this.flashcards = this.loadFlashcards();
        this.quizzes = this.loadQuizzes();
        this.currentNoteId = null;
        this.currentCardIndex = 0;
        this.currentQuizIndex = 0;
        this.quizAnswers = [];
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderNotes();
        this.renderFlashcards();
        this.renderQuizzes();
        this.showTab('notes');
    }

    // Event Listeners Setup
    setupEventListeners() {
        // Tab Navigation
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabName = e.currentTarget.dataset.tab;
                this.showTab(tabName);
            });
        });

        // Notes Tab
        document.getElementById('newNoteBtn').addEventListener('click', () => this.createNewNote());
        document.getElementById('searchNotes').addEventListener('input', (e) => this.searchNotes(e.target.value));
        document.getElementById('notesEditor').addEventListener('input', () => this.saveCurrentNote());
        document.getElementById('notesEditor').addEventListener('mouseup', () => this.handleTextSelection());
        
        // Handle notes editor focus to remove welcome message
        document.getElementById('notesEditor').addEventListener('focus', () => {
            const editor = document.getElementById('notesEditor');
            if (editor.innerHTML === '<p>Start writing your notes here...</p>') {
                editor.innerHTML = '<p><br></p>';
            }
        });

        // Editor Toolbar
        document.querySelectorAll('.toolbar-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const command = e.currentTarget.dataset.command;
                if (command) {
                    this.executeCommand(command);
                }
            });
        });

        // Highlight Options
        document.querySelectorAll('.highlight-option').forEach(option => {
            option.addEventListener('click', (e) => {
                const color = e.currentTarget.dataset.color;
                this.highlightText(color);
            });
        });

        // Flashcard Tab
        document.getElementById('createCardBtn').addEventListener('click', () => this.createFlashcard());
        document.getElementById('prevCard').addEventListener('click', () => this.previousCard());
        document.getElementById('nextCard').addEventListener('click', () => this.nextCard());
        document.getElementById('shuffleCards').addEventListener('click', () => this.shuffleCards());
        
        // Auto-flip main flashcard when clicked
        document.getElementById('flashcard').addEventListener('click', () => this.flipCard());

        // Quiz Tab
        document.getElementById('newQuizBtn').addEventListener('click', () => this.showQuizCreator());
        document.getElementById('takeQuizBtn').addEventListener('click', () => this.showQuizTaker());
        document.getElementById('addQuestionBtn').addEventListener('click', () => this.addQuizQuestion());
        document.getElementById('prevQuestion').addEventListener('click', () => this.previousQuestion());
        document.getElementById('nextQuestion').addEventListener('click', () => this.nextQuestion());
        document.getElementById('submitQuiz').addEventListener('click', () => this.submitQuiz());
        document.getElementById('retakeQuiz').addEventListener('click', () => this.retakeQuiz());
    }

    // Tab Navigation
    showTab(tabName) {
        // Hide all tabs
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });

        // Remove active class from all nav tabs
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
        });

        // Show selected tab
        document.getElementById(tabName).classList.add('active');
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        
        this.currentTab = tabName;
    }

    // Notes Functionality
    createNewNote() {
        const noteId = Date.now().toString();
        const newNote = {
            id: noteId,
            title: 'New Note',
            content: '<p>Start writing your notes here...</p>',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        this.notes.unshift(newNote);
        this.saveNotes();
        this.renderNotes();
        this.loadNote(noteId);
    }

    loadNote(noteId) {
        const note = this.notes.find(n => n.id === noteId);
        if (note) {
            this.currentNoteId = noteId;
            document.getElementById('notesEditor').innerHTML = note.content;
            
            // Update active note in sidebar
            document.querySelectorAll('.note-item').forEach(item => {
                item.classList.remove('active');
            });
            document.querySelector(`[data-note-id="${noteId}"]`).classList.add('active');
        }
    }

    saveCurrentNote() {
        if (this.currentNoteId) {
            const content = document.getElementById('notesEditor').innerHTML;
            const note = this.notes.find(n => n.id === this.currentNoteId);
            if (note) {
                note.content = content;
                note.updatedAt = new Date().toISOString();
                note.title = this.extractTitle(content);
                this.saveNotes();
                this.renderNotes();
            }
        }
    }

    extractTitle(content) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = content;
        const firstText = tempDiv.textContent.trim().split('\n')[0];
        return firstText.substring(0, 50) + (firstText.length > 50 ? '...' : '');
    }

    searchNotes(query) {
        const noteItems = document.querySelectorAll('.note-item');
        noteItems.forEach(item => {
            const title = item.querySelector('.note-title').textContent.toLowerCase();
            const preview = item.querySelector('.note-preview').textContent.toLowerCase();
            const matches = title.includes(query.toLowerCase()) || preview.includes(query.toLowerCase());
            item.style.display = matches ? 'block' : 'none';
        });
    }

    renderNotes() {
        const notesList = document.getElementById('notesList');
        notesList.innerHTML = '';

        this.notes.forEach(note => {
            const noteItem = document.createElement('div');
            noteItem.className = 'note-item';
            noteItem.dataset.noteId = note.id;
            noteItem.innerHTML = `
                <div class="note-title">${note.title}</div>
                <div class="note-preview">${this.stripHtml(note.content).substring(0, 100)}...</div>
            `;
            noteItem.addEventListener('click', () => this.loadNote(note.id));
            notesList.appendChild(noteItem);
        });

        // Load first note if available
        if (this.notes.length > 0 && !this.currentNoteId) {
            this.loadNote(this.notes[0].id);
        }
    }

    // Text Editor Functionality
    handleTextSelection() {
        const selection = window.getSelection();
        if (selection.toString().length > 0) {
            // Show context menu or toolbar options
            this.showContextMenu(selection);
        }
    }

    showContextMenu(selection) {
        // Implementation for context menu
        // This could show a floating toolbar with formatting options
    }

    executeCommand(command) {
        document.execCommand(command, false, null);
        document.getElementById('notesEditor').focus();
    }

    highlightText(color) {
        const selection = window.getSelection();
        if (selection.toString().length > 0) {
            const range = selection.getRangeAt(0);
            const span = document.createElement('span');
            span.style.backgroundColor = color === 'yellow' ? '#FFF3CD' : '#F8D7DA';
            range.surroundContents(span);
            selection.removeAllRanges();
        }
    }

    // Flashcard Functionality
    createFlashcard() {
        const term = document.getElementById('termInput').value.trim();
        const definition = document.getElementById('definitionInput').value.trim();

        if (term && definition) {
            const card = {
                id: Date.now().toString(),
                term: term,
                definition: definition,
                createdAt: new Date().toISOString()
            };

            this.flashcards.push(card);
            this.saveFlashcards();
            this.renderFlashcards();
            this.renderCardsList();
            
            // Clear form
            document.getElementById('termInput').value = '';
            document.getElementById('definitionInput').value = '';
            
            // Show the new card
            this.currentCardIndex = this.flashcards.length - 1;
            this.displayCurrentCard();
        }
    }

    displayCurrentCard() {
        if (this.flashcards.length === 0) {
            document.getElementById('cardTerm').textContent = 'No cards yet. Add your first card!';
            document.getElementById('cardDefinition').textContent = 'Click "Add Card" to get started.';
            document.getElementById('cardCounter').textContent = '0 / 0';
            return;
        }

        const card = this.flashcards[this.currentCardIndex];
        document.getElementById('cardTerm').textContent = card.term;
        document.getElementById('cardDefinition').textContent = card.definition;
        document.getElementById('cardCounter').textContent = `${this.currentCardIndex + 1} / ${this.flashcards.length}`;
        
        // Reset card flip state
        document.getElementById('flashcard').classList.remove('flipped');
    }

    previousCard() {
        if (this.flashcards.length > 0) {
            this.currentCardIndex = (this.currentCardIndex - 1 + this.flashcards.length) % this.flashcards.length;
            this.displayCurrentCard();
        }
    }

    nextCard() {
        if (this.flashcards.length > 0) {
            this.currentCardIndex = (this.currentCardIndex + 1) % this.flashcards.length;
            this.displayCurrentCard();
        }
    }

    flipCard() {
        const flashcard = document.getElementById('flashcard');
        flashcard.classList.toggle('flipped');
    }

    shuffleCards() {
        if (this.flashcards.length > 0) {
            for (let i = this.flashcards.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [this.flashcards[i], this.flashcards[j]] = [this.flashcards[j], this.flashcards[i]];
            }
            this.currentCardIndex = 0;
            this.displayCurrentCard();
            this.renderCardsList();
        }
    }

    renderFlashcards() {
        this.displayCurrentCard();
        this.renderCardsList();
    }

    renderCardsList() {
        const cardsList = document.getElementById('cardsList');
        cardsList.innerHTML = '';

        this.flashcards.forEach((card, index) => {
            const cardItem = document.createElement('div');
            cardItem.className = 'card-item';
            cardItem.dataset.cardId = card.id;
            cardItem.dataset.cardIndex = index;
            
            cardItem.innerHTML = `
                <div class="card-drag-handle">
                    <i class="fas fa-grip-lines"></i>
                </div>
                <div class="card-content">
                    <div class="card-inner-list">
                        <div class="card-front-list">
                            <div class="card-term">${card.term}</div>
                        </div>
                        <div class="card-back-list">
                            <div class="card-definition">${card.definition}</div>
                        </div>
                    </div>
                </div>
            `;

            // Add event listeners for drag functionality
            this.setupCardDragListeners(cardItem, card, index);
            
            // Add click to select card and flip
            cardItem.addEventListener('click', (e) => {
                if (!e.target.closest('.card-drag-handle')) {
                    this.selectCard(index);
                    this.flipCardInList(cardItem);
                }
            });

            cardsList.appendChild(cardItem);
        });
    }

    setupCardDragListeners(cardItem, card, index) {
        const dragHandle = cardItem.querySelector('.card-drag-handle');
        let isDragging = false;
        let dragStartY = 0;
        let originalIndex = index;

        // Mouse events for drag handle
        dragHandle.addEventListener('mousedown', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.startDrag(cardItem, index, e);
        });

        // Touch events for drag handle
        dragHandle.addEventListener('touchstart', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.startDrag(cardItem, index, e);
        });
    }

    startDrag(cardItem, index, e) {
        const cardsList = document.getElementById('cardsList');
        const deleteZone = document.getElementById('deleteZone');
        
        let isDragging = true;
        let dragStartY = e.type === 'mousedown' ? e.clientY : e.touches[0].clientY;
        let originalIndex = index;

        cardItem.classList.add('dragging');
        
        // Create ghost element
        const ghost = cardItem.cloneNode(true);
        ghost.style.position = 'fixed';
        ghost.style.top = '-1000px';
        ghost.style.pointerEvents = 'none';
        ghost.style.zIndex = '10000';
        document.body.appendChild(ghost);
        cardItem.dataset.ghostId = ghost.id = 'ghost-' + Date.now();

        const drag = (e) => {
            if (!isDragging) return;
            
            e.preventDefault();
            const currentY = e.type === 'mousemove' ? e.clientY : e.touches[0].clientY;
            
            // Move ghost element
            const ghost = document.getElementById(cardItem.dataset.ghostId);
            if (ghost) {
                ghost.style.top = (currentY - 30) + 'px';
                ghost.style.left = (e.type === 'mousemove' ? e.clientX : e.touches[0].clientX) - 30 + 'px';
            }

            // Check if over delete zone
            const deleteRect = deleteZone.getBoundingClientRect();
            const isOverDelete = currentY >= deleteRect.top && currentY <= deleteRect.bottom &&
                               (e.type === 'mousemove' ? e.clientX : e.touches[0].clientX) >= deleteRect.left &&
                               (e.type === 'mousemove' ? e.clientX : e.touches[0].clientX) <= deleteRect.right;

            if (isOverDelete) {
                deleteZone.classList.add('drag-over');
            } else {
                deleteZone.classList.remove('drag-over');
            }

            // Reorder cards
            const cardItems = Array.from(cardsList.querySelectorAll('.card-item:not(.dragging)'));
            const cardRects = cardItems.map(item => item.getBoundingClientRect());
            
            let newIndex = originalIndex;
            for (let i = 0; i < cardRects.length; i++) {
                const rect = cardRects[i];
                if (currentY < rect.top + rect.height / 2) {
                    newIndex = i;
                    break;
                }
                newIndex = i + 1;
            }

            if (newIndex !== originalIndex) {
                this.reorderCards(originalIndex, newIndex);
                originalIndex = newIndex;
            }
        };

        const endDrag = (e) => {
            if (!isDragging) return;
            
            isDragging = false;
            cardItem.classList.remove('dragging');
            
            // Remove ghost
            const ghost = document.getElementById(cardItem.dataset.ghostId);
            if (ghost) {
                ghost.remove();
            }

            // Check if dropped in delete zone
            const deleteRect = deleteZone.getBoundingClientRect();
            const isOverDelete = (e.type === 'mouseup' ? e.clientY : e.changedTouches[0].clientY) >= deleteRect.top &&
                               (e.type === 'mouseup' ? e.clientY : e.changedTouches[0].clientY) <= deleteRect.bottom &&
                               (e.type === 'mouseup' ? e.clientX : e.changedTouches[0].clientX) >= deleteRect.left &&
                               (e.type === 'mouseup' ? e.clientX : e.changedTouches[0].clientX) <= deleteRect.right;

            if (isOverDelete) {
                this.deleteCard(originalIndex);
            }

            // Clean up
            deleteZone.classList.remove('drag-over');
            
            // Remove event listeners
            document.removeEventListener('mousemove', drag);
            document.removeEventListener('mouseup', endDrag);
            document.removeEventListener('touchmove', drag);
            document.removeEventListener('touchend', endDrag);
        };

        // Add event listeners
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', endDrag);
        document.addEventListener('touchmove', drag);
        document.addEventListener('touchend', endDrag);
    }

    flipCardInList(cardItem) {
        const cardInner = cardItem.querySelector('.card-inner-list');
        cardInner.classList.toggle('flipped');
    }

    reorderCards(fromIndex, toIndex) {
        if (fromIndex === toIndex) return;
        
        const card = this.flashcards.splice(fromIndex, 1)[0];
        this.flashcards.splice(toIndex, 0, card);
        
        // Update current card index if needed
        if (this.currentCardIndex === fromIndex) {
            this.currentCardIndex = toIndex;
        } else if (this.currentCardIndex > fromIndex && this.currentCardIndex <= toIndex) {
            this.currentCardIndex--;
        } else if (this.currentCardIndex < fromIndex && this.currentCardIndex >= toIndex) {
            this.currentCardIndex++;
        }
        
        this.saveFlashcards();
        this.renderCardsList();
        this.displayCurrentCard();
    }

    deleteCard(index) {
        const cardItem = document.querySelector(`[data-card-index="${index}"]`);
        if (cardItem) {
            cardItem.classList.add('deleting');
            
            setTimeout(() => {
                this.flashcards.splice(index, 1);
                
                // Update current card index if needed
                if (this.currentCardIndex >= index) {
                    this.currentCardIndex = Math.max(0, this.currentCardIndex - 1);
                }
                
                this.saveFlashcards();
                this.renderFlashcards();
            }, 600); // Wait for animation to complete
        }
    }

    selectCard(index) {
        this.currentCardIndex = index;
        this.displayCurrentCard();
        
        // Update visual selection
        document.querySelectorAll('.card-item').forEach(item => {
            item.classList.remove('selected');
        });
        document.querySelector(`[data-card-index="${index}"]`).classList.add('selected');
    }

    // Quiz Functionality
    showQuizCreator() {
        document.getElementById('quizCreator').classList.remove('hidden');
        document.getElementById('quizTaker').classList.add('hidden');
        document.getElementById('quizResults').classList.add('hidden');
    }

    showQuizTaker() {
        if (this.quizzes.length === 0) {
            alert('No quizzes available. Please create a quiz first.');
            return;
        }

        document.getElementById('quizCreator').classList.add('hidden');
        document.getElementById('quizTaker').classList.remove('hidden');
        document.getElementById('quizResults').classList.add('hidden');
        
        this.currentQuizIndex = 0;
        this.quizAnswers = new Array(this.quizzes.length).fill(null);
        this.displayCurrentQuestion();
    }

    addQuizQuestion() {
        const question = document.getElementById('questionInput').value.trim();
        const answerInputs = document.querySelectorAll('.answer-input');
        const correctAnswer = document.querySelector('input[name="correctAnswer"]:checked');

        if (!question || !correctAnswer) {
            alert('Please fill in the question and select the correct answer.');
            return;
        }

        const answers = Array.from(answerInputs).map(input => input.value.trim());
        if (answers.some(answer => !answer)) {
            alert('Please fill in all answer options.');
            return;
        }

        const quizQuestion = {
            id: Date.now().toString(),
            question: question,
            answers: answers,
            correctAnswer: parseInt(correctAnswer.value),
            createdAt: new Date().toISOString()
        };

        this.quizzes.push(quizQuestion);
        this.saveQuizzes();
        this.renderQuizzes();

        // Clear form
        document.getElementById('questionInput').value = '';
        answerInputs.forEach(input => input.value = '');
        document.querySelectorAll('input[name="correctAnswer"]').forEach(radio => radio.checked = false);
    }

    displayCurrentQuestion() {
        if (this.quizzes.length === 0) {
            document.getElementById('currentQuestion').textContent = 'No questions available.';
            return;
        }

        const question = this.quizzes[this.currentQuizIndex];
        document.getElementById('currentQuestion').textContent = question.question;
        document.getElementById('questionCounter').textContent = `Question ${this.currentQuizIndex + 1} of ${this.quizzes.length}`;
        
        // Update progress bar
        const progress = ((this.currentQuizIndex + 1) / this.quizzes.length) * 100;
        document.getElementById('progressFill').style.width = `${progress}%`;

        // Render answer options
        const answersContainer = document.getElementById('quizAnswers');
        answersContainer.innerHTML = '';
        
        question.answers.forEach((answer, index) => {
            const answerElement = document.createElement('div');
            answerElement.className = 'quiz-answer';
            answerElement.textContent = answer;
            answerElement.addEventListener('click', () => this.selectAnswer(index));
            
            // Mark as selected if previously answered
            if (this.quizAnswers[this.currentQuizIndex] === index) {
                answerElement.classList.add('selected');
            }
            
            answersContainer.appendChild(answerElement);
        });

        // Update navigation buttons
        document.getElementById('prevQuestion').disabled = this.currentQuizIndex === 0;
        const isLastQuestion = this.currentQuizIndex === this.quizzes.length - 1;
        document.getElementById('nextQuestion').style.display = isLastQuestion ? 'none' : 'inline-flex';
        document.getElementById('submitQuiz').style.display = isLastQuestion ? 'inline-flex' : 'none';
    }

    selectAnswer(answerIndex) {
        this.quizAnswers[this.currentQuizIndex] = answerIndex;
        
        // Update visual selection
        document.querySelectorAll('.quiz-answer').forEach((answer, index) => {
            answer.classList.toggle('selected', index === answerIndex);
        });

        // Check if instant feedback is enabled
        const instantFeedback = document.getElementById('instantFeedback').checked;
        if (instantFeedback) {
            this.showInstantFeedback(answerIndex);
        }
    }

    showInstantFeedback(selectedAnswer) {
        const question = this.quizzes[this.currentQuizIndex];
        const isCorrect = selectedAnswer === question.correctAnswer;
        
        // Update answer styling
        document.querySelectorAll('.quiz-answer').forEach((answer, index) => {
            answer.classList.remove('correct', 'incorrect');
            if (index === selectedAnswer) {
                answer.classList.add(isCorrect ? 'correct' : 'incorrect');
            } else if (index === question.correctAnswer) {
                answer.classList.add('correct');
            }
        });

        // Show feedback message
        const feedbackMessage = document.getElementById('feedbackMessage');
        feedbackMessage.textContent = isCorrect ? 'Correct!' : 'Incorrect!';
        feedbackMessage.className = `feedback-message ${isCorrect ? 'correct' : 'incorrect'}`;
        feedbackMessage.style.display = 'block';

        // Auto-hide feedback after 2 seconds
        setTimeout(() => {
            feedbackMessage.style.display = 'none';
        }, 2000);
    }

    previousQuestion() {
        if (this.currentQuizIndex > 0) {
            this.currentQuizIndex--;
            this.displayCurrentQuestion();
        }
    }

    nextQuestion() {
        if (this.currentQuizIndex < this.quizzes.length - 1) {
            this.currentQuizIndex++;
            this.displayCurrentQuestion();
        }
    }

    submitQuiz() {
        const results = this.calculateQuizResults();
        this.showQuizResults(results);
    }

    calculateQuizResults() {
        let correct = 0;
        const details = [];

        this.quizzes.forEach((question, index) => {
            const userAnswer = this.quizAnswers[index];
            const isCorrect = userAnswer === question.correctAnswer;
            if (isCorrect) correct++;

            details.push({
                question: question.question,
                userAnswer: userAnswer !== null ? question.answers[userAnswer] : 'Not answered',
                correctAnswer: question.answers[question.correctAnswer],
                isCorrect: isCorrect
            });
        });

        return {
            correct: correct,
            total: this.quizzes.length,
            percentage: Math.round((correct / this.quizzes.length) * 100),
            details: details
        };
    }

    showQuizResults(results) {
        document.getElementById('quizCreator').classList.add('hidden');
        document.getElementById('quizTaker').classList.add('hidden');
        document.getElementById('quizResults').classList.remove('hidden');

        document.getElementById('finalScore').textContent = `${results.percentage}%`;
        
        const detailsContainer = document.getElementById('resultsDetails');
        detailsContainer.innerHTML = '';
        
        results.details.forEach((detail, index) => {
            const resultItem = document.createElement('div');
            resultItem.className = `result-item ${detail.isCorrect ? 'correct' : 'incorrect'}`;
            resultItem.innerHTML = `
                <strong>Question ${index + 1}:</strong> ${detail.question}<br>
                <strong>Your Answer:</strong> ${detail.userAnswer}<br>
                <strong>Correct Answer:</strong> ${detail.correctAnswer}
            `;
            detailsContainer.appendChild(resultItem);
        });
    }

    retakeQuiz() {
        this.showQuizTaker();
    }

    renderQuizzes() {
        // This could show a list of available quizzes
        // For now, we'll just update the quiz count
        const quizCount = this.quizzes.length;
        document.getElementById('takeQuizBtn').textContent = `Take Quiz (${quizCount})`;
    }

    // Utility Functions
    stripHtml(html) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        return tempDiv.textContent || tempDiv.innerText || '';
    }

    // Data Persistence
    saveNotes() {
        localStorage.setItem('studyWeb_notes', JSON.stringify(this.notes));
    }

    loadNotes() {
        const saved = localStorage.getItem('studyWeb_notes');
        return saved ? JSON.parse(saved) : [];
    }

    saveFlashcards() {
        localStorage.setItem('studyWeb_flashcards', JSON.stringify(this.flashcards));
    }

    loadFlashcards() {
        const saved = localStorage.getItem('studyWeb_flashcards');
        return saved ? JSON.parse(saved) : [];
    }

    saveQuizzes() {
        localStorage.setItem('studyWeb_quizzes', JSON.stringify(this.quizzes));
    }

    loadQuizzes() {
        const saved = localStorage.getItem('studyWeb_quizzes');
        return saved ? JSON.parse(saved) : [];
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.studyApp = new StudyWebApp();
}); 