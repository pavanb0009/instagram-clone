import React from 'react'
import CreatePosts from './CreatePosts'
import CreateReels from './CreateReels'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const CreateMain = () => {
    return (
        <div className="flex items-center justify-center h-full">
            <Tabs defaultValue="posts" className="w-[700px]">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="posts">Create post</TabsTrigger>
                    <TabsTrigger value="reels">Create reels</TabsTrigger>
                </TabsList>
                <TabsContent value="posts">
                    <CreatePosts />
                </TabsContent>
                <TabsContent value="reels">
                    <CreateReels />
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default CreateMain