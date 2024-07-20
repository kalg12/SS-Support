"use client";

import { useState } from "react";
import { useCreateTicketMutation } from "@/services/ticketApi";
import Swal from "sweetalert2";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const CreateTicket = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [createTicket] = useCreateTicketMutation();

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await createTicket({ title, description }).unwrap();
      if (response.success) {
        Swal.fire({
          title: "Success",
          text: "Ticket created successfully!",
          icon: "success",
          confirmButtonText: "OK",
        });
        setTitle("");
        setDescription("");
      } else {
        Swal.fire({
          title: "Error",
          text: response.message,
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error("Error creating ticket:", error);
      Swal.fire({
        title: "Error",
        text: "An error occurred while creating the ticket",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">Create Ticket</h2>
        <form onSubmit={handleCreateTicket}>
          <div className="mb-4">
            <Label htmlFor="title" className="block text-gray-700">
              Title
            </Label>
            <Input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="mb-6">
            <Label htmlFor="description" className="block text-gray-700">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded"
          >
            Create Ticket
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreateTicket;
