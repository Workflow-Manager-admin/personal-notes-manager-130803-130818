import { Component, OnInit, OnDestroy } from '@angular/core';
import { NotesService, Note } from './notes.service';
import { Subscription } from 'rxjs';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-notes',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css'],
  providers: [],
})
export class NotesComponent implements OnInit, OnDestroy {
  notes: Note[] = [];
  selectedNote: Note | null = null;
  newNoteTitle = '';
  newNoteContent = '';
  editMode = false;
  loading = false;
  errorMsg = '';
  private notesSub?: Subscription;
  colors = {
    primary: '#1976d2',
    secondary: '#424242',
    accent: '#ffca28'
  };

  constructor(private _notesService: NotesService) {}

  ngOnInit(): void {
    this.notesSub = this._notesService.notes$.subscribe((notes: Note[]) => {
      this.notes = notes;
      if (this.selectedNote) {
        this.selectedNote = notes.find((n) => n.id === this.selectedNote?.id) || null;
      }
    });
    // If supabase could not be initialized, avoid fetch call and show warning
    if (this._notesService.isAvailable()) {
      this._notesService.fetchNotes();
    } else {
      this.errorMsg = "Supabase not available: check environment variables.";
    }
  }

  ngOnDestroy(): void {
    this.notesSub?.unsubscribe();
  }

  selectNote(note: Note): void {
    this.selectedNote = { ...note };
    this.editMode = false;
    this.errorMsg = '';
    this.newNoteTitle = '';
    this.newNoteContent = '';
  }

  newNote(): void {
    this.selectedNote = null;
    this.editMode = true;
    this.newNoteTitle = '';
    this.newNoteContent = '';
    this.errorMsg = '';
  }

  editNote(): void {
    if (this.selectedNote) {
      this.editMode = true;
      this.newNoteTitle = this.selectedNote.title;
      this.newNoteContent = this.selectedNote.content;
    }
    this.errorMsg = '';
  }

  saveNote(): void {
    this.loading = true;
    this.errorMsg = '';
    const title = this.newNoteTitle.trim();
    const content = this.newNoteContent.trim();

    if (!title) {
      this.errorMsg = "Title is required";
      this.loading = false;
      return;
    }

    if (this.selectedNote && this.selectedNote.id) {
      // Update
      this._notesService
        .updateNote(this.selectedNote.id, title, content)
        .subscribe(({ error }: { error?: any }) => {
          this.loading = false;
          if (error) {
            this.errorMsg = "Failed to update note";
            return;
          }
          this.editMode = false;
          this.selectedNote = null;
          this._notesService.fetchNotes();
        });
    } else {
      // Create
      this._notesService.addNote(title, content).subscribe(({ error }: { error?: any }) => {
        this.loading = false;
        if (error) {
          this.errorMsg = "Failed to add note";
          return;
        }
        this.editMode = false;
        this.selectedNote = null;
        this._notesService.fetchNotes();
      });
    }
  }

  deleteNote(note: Note): void {
    if (
      typeof globalThis !== 'undefined' &&
      typeof (globalThis as any).confirm === 'function' &&
      (globalThis as any).confirm(`Delete "${note.title}"?`)
    ) {
      this.loading = true;
      this._notesService.deleteNote(note.id).subscribe(({ error }: { error?: any }) => {
        this.loading = false;
        if (error) {
          this.errorMsg = "Failed to delete note";
          return;
        }
        if (this.selectedNote && this.selectedNote.id === note.id) {
          this.selectedNote = null;
          this.editMode = false;
        }
        this._notesService.fetchNotes();
      });
    }
  }

  cancelEdit(): void {
    this.editMode = false;
    if (this.selectedNote) {
      this.selectNote(this.selectedNote);
    } else {
      this.selectedNote = null;
    }
    this.errorMsg = '';
  }
}
