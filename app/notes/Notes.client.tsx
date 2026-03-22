'use client';

import { useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';
import { fetchNotes } from '@/lib/api';
import { Toaster } from 'react-hot-toast';
import css from '@/app/notes/Notes.module.css';
import SearchBox from '@/components/SearchBox/SearchBox';
import Pagination from '@/components/Pagination/Pagination';
import Modal from '@/components/Modal/Modal';
import NoteForm from '@/components/NoteForm/NoteForm';
import NoteList from '@/components/NoteList/NoteList';
import Loader from '@/app/loading';
import ErrorMessage from '@/app/error';

interface Props {
  initialPage: number;
}

export default function NoteClient({ initialPage }: Props) {
  const [page, setPage] = useState<number>(initialPage);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [debounceedSearch] = useDebounce(searchQuery, 500);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['notes', page, debounceedSearch],
    queryFn: () =>
      fetchNotes({
        page,
        perPage: 12,
        search: debounceedSearch,
      }),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
  });

  const handleSearchChange = (value: string): void => {
    setSearchQuery(value);
    setPage(1);
  };

  const handlePageChange = (newPage: number): void => {
    setPage(newPage);
  };

  const handleNoteCreated = (): void => {
    setIsModalOpen(false);
    setPage(1);
  };

  const handleOpenModal = (): void => {
    setIsModalOpen(true);
  };

  const handleCloseModal = (): void => {
    setIsModalOpen(false);
  };

  const notes = data?.notes || [];
  const totalPages = data?.totalPages || 0;

  return (
    <>
      <div className={css.app}>
        <Toaster position="top-center" />

        <header className={css.toolbar}>
          <SearchBox value={searchQuery} onChange={handleSearchChange} />

          {totalPages > 1 && (
            <Pagination
              totalPages={totalPages}
              currentPage={page}
              onPageChange={handlePageChange}
            />
          )}

          <button
            type="button"
            className={css.button}
            onClick={handleOpenModal}
          >
            Create note +
          </button>
        </header>

        {isLoading && <Loader />}
        {isError && error && <ErrorMessage error={error} />}

        {!isLoading && !isError && notes.length > 0 && (
          <NoteList notes={notes} />
        )}

        {!isLoading && !isError && notes.length === 0 && (
          <p className={css.emptyMessage}>
            {searchQuery ? 'No notes found for your search' : null}
          </p>
        )}

        {isModalOpen && (
          <Modal onClose={handleCloseModal}>
            <NoteForm
              onSuccess={handleNoteCreated}
              onCancel={handleCloseModal}
            />
          </Modal>
        )}
      </div>
    </>
  );
}
