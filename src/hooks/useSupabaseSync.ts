import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useInspirationStore } from '@/store/useInspirationStore';
import { Inspiration } from '@/types';

export function useSupabaseSync() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {
    inspirations,
    addInspiration,
    updateInspiration,
    deleteInspiration,
    setInspirations,
  } = useInspirationStore();

  const fetchInspirations = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('inspirations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mappedData: Inspiration[] = data.map(item => ({
        id: item.id,
        title: item.title,
        content: item.content || '',
        tags: item.tags || [],
        priority: item.priority,
        color: item.color,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
        drawing: item.drawing,
      }));

      setInspirations(mappedData);
    } catch (err: any) {
      console.error('Error fetching inspirations:', err);
      setError(err.message || 'Failed to fetch inspirations');
    } finally {
      setIsLoading(false);
    }
  };

  const syncAddInspiration = async (inspiration: Omit<Inspiration, 'id' | 'createdAt' | 'updatedAt'>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('inspirations')
        .insert([{
          title: inspiration.title,
          content: inspiration.content,
          tags: inspiration.tags,
          priority: inspiration.priority,
          color: inspiration.color,
          drawing: inspiration.drawing || null,
        }])
        .select()
        .single();

      if (error) throw error;

      const newInspiration: Inspiration = {
        id: data.id,
        title: data.title,
        content: data.content || '',
        tags: data.tags || [],
        priority: data.priority,
        color: data.color,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        drawing: data.drawing,
      };

      addInspiration(newInspiration);
      return newInspiration;
    } catch (err: any) {
      console.error('Error adding inspiration:', err);
      setError(err.message || 'Failed to add inspiration');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const syncUpdateInspiration = async (id: string, updates: Partial<Inspiration>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase
        .from('inspirations')
        .update({
          title: updates.title,
          content: updates.content,
          tags: updates.tags,
          priority: updates.priority,
          color: updates.color,
          drawing: updates.drawing,
        })
        .eq('id', id);

      if (error) throw error;

      updateInspiration(id, updates);
    } catch (err: any) {
      console.error('Error updating inspiration:', err);
      setError(err.message || 'Failed to update inspiration');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const syncDeleteInspiration = async (id: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase
        .from('inspirations')
        .delete()
        .eq('id', id);

      if (error) throw error;

      deleteInspiration(id);
    } catch (err: any) {
      console.error('Error deleting inspiration:', err);
      setError(err.message || 'Failed to delete inspiration');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    fetchInspirations,
    syncAddInspiration,
    syncUpdateInspiration,
    syncDeleteInspiration,
  };
}
