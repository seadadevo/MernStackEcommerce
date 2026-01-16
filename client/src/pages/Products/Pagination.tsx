import { Button } from '@/components/ui/button';
import React from 'react'

const Pagination = ({  totalItems ,itemsPerPage ,currentPage ,onPageChange }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    if(totalPages < 1) {
        return null;
    }

  return (
    <div className='flex justify-center gap-2 mt-10'>
        <Button 
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}>
        Prev
        </Button>
        {
            [...Array(totalPages)].map((_,i) => (
                <Button
                key={i}
                variant={currentPage === i + 1 ? "default" : "outline"}                
                onClick={() => onPageChange(i + 1)}
                >
                    {i + 1}
                </Button>
            ))
        }
        <Button disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}>
        Next
        </Button>

    </div>
  )
}

export default Pagination