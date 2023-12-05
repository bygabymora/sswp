import React from 'react';
import Image from 'next/image';
import { IoMdStar } from 'react-icons/io';

export default function Testimonio({ testimonio }) {
  return (
    <div className="testimonial-container h-[30%]">
      <div className="avatar-container">
        <Image
          src={testimonio?.avatar}
          alt={testimonio?.name}
          width={1000}
          height={1000}
          className="avatar"
        />
      </div>

      <div className="testimonial-content">
        <div className="flex flex-row items-center text-center justify-center">
          <h1 className="font-bold">{testimonio?.title} &nbsp;</h1>
          <IoMdStar />
          <IoMdStar />
          <IoMdStar />
          <IoMdStar />
          <IoMdStar />
        </div>
        <p>{testimonio?.description}</p>
        <p className="font-bold">- {testimonio?.name}</p>
      </div>
    </div>
  );
}
