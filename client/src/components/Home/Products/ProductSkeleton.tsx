import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

const ProductSkeleton = () => {
  return (
    <div className="flex flex-col space-y-4 bg-white rounded-2xl p-4 border border-gray-100">
        <Skeleton className="aspect-square w-full rounded-xl" />
        <div className="space-y-3">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-4 w-full" />
          <div className="flex justify-between items-center pt-2">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-9 w-20" />
          </div>
        </div>
      </div>
  )
}

export default ProductSkeleton