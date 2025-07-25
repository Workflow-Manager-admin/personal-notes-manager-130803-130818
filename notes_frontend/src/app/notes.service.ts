import { Injectable } from "@angular/core";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { BehaviorSubject, from, Observable } from "rxjs";

/**
 * Note interface representing the shape of a note object.
 */
export interface Note {
  id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

/**
 * The NotesService provides CRUD operations using Supabase.
 */
// PUBLIC_INTERFACE
@Injectable({
  providedIn: "root",
})
export class NotesService {
  private supabase: SupabaseClient | null = null;
  private notesSubject = new BehaviorSubject<Note[]>([]);
  public notes$ = this.notesSubject.asObservable();

  constructor() {
    // SSR and build: avoid crashing if env not set
    let supabaseUrl = "";
    let supabaseKey = "";
    if (typeof globalThis !== 'undefined' && (globalThis as any).env) {
      supabaseUrl = (globalThis as any).env.NG_APP_SUPABASE_URL;
      supabaseKey = (globalThis as any).env.NG_APP_SUPABASE_KEY;
    } else if ((import.meta as any).env) {
      supabaseUrl = (import.meta as any).env?.NG_APP_SUPABASE_URL;
      supabaseKey = (import.meta as any).env?.NG_APP_SUPABASE_KEY;
    }
    if (supabaseUrl && supabaseKey) {
      this.supabase = createClient(supabaseUrl, supabaseKey);
    }
  }

  isAvailable() {
    return !!this.supabase;
  }

  /**
   * Get all notes from the backend, sorted by updated_at desc.
   */
  // PUBLIC_INTERFACE
  fetchNotes() {
    if (!this.supabase) {
      this.notesSubject.next([]);
      return;
    }
    from(
      this.supabase
        .from("notes")
        .select("*")
        .order("updated_at", { ascending: false })
    ).subscribe(({ data, error }) => {
      if (error) {
        console.error("Error fetching notes", error);
        return;
      }
      this.notesSubject.next(data as Note[]);
    });
  }

  /**
   * Add a new note.
   */
  // PUBLIC_INTERFACE
  addNote(title: string, content: string): Observable<any> {
    if (!this.supabase) return from(Promise.resolve({ error: { message: 'Supabase not initialized' } }));
    const insertPromise = this.supabase
      .from("notes")
      .insert([{ title, content }])
      .select("*")
      .single();

    return from(insertPromise).pipe();
  }

  /**
   * Update an existing note.
   */
  // PUBLIC_INTERFACE
  updateNote(id: number, title: string, content: string): Observable<any> {
    if (!this.supabase) return from(Promise.resolve({ error: { message: 'Supabase not initialized' } }));
    const updatePromise = this.supabase
      .from("notes")
      .update({ title, content, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select("*")
      .single();

    return from(updatePromise);
  }

  /**
   * Delete a note by id.
   */
  // PUBLIC_INTERFACE
  deleteNote(id: number): Observable<any> {
    if (!this.supabase) return from(Promise.resolve({ error: { message: 'Supabase not initialized' } }));
    const deletePromise = this.supabase
      .from("notes")
      .delete()
      .eq("id", id);

    return from(deletePromise);
  }
}
