import { create } from 'zustand';
import { Style, Category, Generation } from '@/types';

interface AppState {
  // Styles
  styles: Style[];
  categories: Category[];
  selectedStyle: Style | null;
  setStyles: (styles: Style[]) => void;
  setCategories: (categories: Category[]) => void;
  setSelectedStyle: (style: Style | null) => void;

  // Generation
  generations: Generation[];
  currentGeneration: Generation | null;
  isGenerating: boolean;
  setGenerations: (generations: Generation[]) => void;
  addGeneration: (generation: Generation) => void;
  updateGeneration: (id: string, updates: Partial<Generation>) => void;
  setCurrentGeneration: (generation: Generation | null) => void;
  setIsGenerating: (isGenerating: boolean) => void;

  // UI State
  uploadedImage: string | null;
  uploadedImageFile: File | null;
  setUploadedImage: (image: string | null, file?: File | null) => void;

  // Modal states
  isStyleModalOpen: boolean;
  isConfirmModalOpen: boolean;
  setStyleModalOpen: (isOpen: boolean) => void;
  setConfirmModalOpen: (isOpen: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Styles
  styles: [],
  categories: [],
  selectedStyle: null,
  setStyles: (styles) => set({ styles }),
  setCategories: (categories) => set({ categories }),
  setSelectedStyle: (style) => set({ selectedStyle: style }),

  // Generation
  generations: [],
  currentGeneration: null,
  isGenerating: false,
  setGenerations: (generations) => set({ generations }),
  addGeneration: (generation) =>
    set((state) => ({ generations: [generation, ...state.generations] })),
  updateGeneration: (id, updates) =>
    set((state) => ({
      generations: state.generations.map((g) =>
        g.id === id ? { ...g, ...updates } : g
      ),
    })),
  setCurrentGeneration: (generation) => set({ currentGeneration: generation }),
  setIsGenerating: (isGenerating) => set({ isGenerating }),

  // UI State
  uploadedImage: null,
  uploadedImageFile: null,
  setUploadedImage: (image, file = null) =>
    set({ uploadedImage: image, uploadedImageFile: file }),

  // Modal states
  isStyleModalOpen: false,
  isConfirmModalOpen: false,
  setStyleModalOpen: (isOpen) => set({ isStyleModalOpen: isOpen }),
  setConfirmModalOpen: (isOpen) => set({ isConfirmModalOpen: isOpen }),
}));
