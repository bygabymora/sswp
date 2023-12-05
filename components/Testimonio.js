import React from 'react';
import Image from 'next/image';
import { IoMdStar } from 'react-icons/io';

export default function Testimonio({ testimonial }) {
  return (
    <div className="testimonial-container">
      <div className="avatar-container">
        <Image
          src={testimonial?.avatar}
          alt={testimonial?.name}
          width={1000}
          height={1000}
          className="avatar"
        />
      </div>

      <div className="testimonial-content">
        <div className="flex flex-row items-center text-center justify-center">
          <h1 className="font-bold">{testimonial?.title} &nbsp;</h1>
          <IoMdStar />
          <IoMdStar />
          <IoMdStar />
          <IoMdStar />
          <IoMdStar />
        </div>
        <p>{testimonial?.description}</p>
        <p className="font-bold">- {testimonial?.name}</p>
      </div>
    </div>
  );
}
