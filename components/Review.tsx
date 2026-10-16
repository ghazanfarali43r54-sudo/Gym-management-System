import Image from "next/image";

type Testimonial = {
  name: string;
  role?: string;
  image: string;
  quote: string;
};

const testimonials: Testimonial[] = [
  {
    name: "Matti Ur Rehman",
    image: "/images/user2.png",
    quote:
      "I was struggling with serious health issues due to excessive weight. Vostro World truly transformed my life. The professional trainers designed a program that helped me lose weight steadily.",
  },
  {
    name: "Mian Zaka",
    role: "Advocate",
    image: "/images/user3.png",
    quote:
      "I went from 97kg to 75kg at Vostro World and it has been an incredible transformation. The group classes were a game changer for me. The energy, teamwork, and motivation in every session kept me going. The trainers are highly professional."
  },
  {
    name: "Arbab Alamgir",
    role: "Doctor",
    image: "/images/user4.png",
    quote:
      "Very productive environment. Overall Vostro World facilities are excellent, the equipment is well maintained and the staff is cooperative. Highly recommended for anyone who is serious about fitness.",
  },
  {
    name: "Sameen Shahid",
    image: "/images/user5.png",
    quote:
      "I lost 16kg in just 4 months at Vostro World and it has been the most rewarding journey. The trainers keep you accountable and the atmosphere keeps you motivated every single day.",
  },
];

function Stars() {
  return (
    <div className="flex gap-1" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-6 w-6 text-yellow-400 sm:h-7 sm:w-7"
          aria-hidden
        >
          <path d="m12 2.5 2.9 6.2 6.8.8-5 4.7 1.3 6.7L12 17.5 6 20.9l1.3-6.7-5-4.7 6.8-.8L12 2.5Z" />
        </svg>
      ))}
    </div>
  );
}

function TestimonialCard({ item }: { item: Testimonial }) {
  return (
    <article className="relative mt-14 rounded-[2rem] bg-white px-6 pb-8 pt-4 shadow-[0_6px_18px_rgba(0,0,0,0.18)] sm:px-8">
      {/* Avatar: card ke upar overlap karta hai */}
      <div className="absolute -top-12 left-6 h-28 w-28 overflow-hidden rounded-full bg-neutral-900 sm:left-8 sm:h-32 sm:w-32">
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="128px"
          className="object-cover"
        />
      </div>

      {/* Stars: card ki top line ke upar, avatar ke right me */}
      <div className="absolute -top-9 left-[8.5rem] sm:left-[10.5rem]">
        <Stars />
      </div>

      {/* Name: avatar ke right me */}
      <div className="flex min-h-[4.5rem] items-center pl-[7.5rem] sm:min-h-[5.5rem] sm:pl-[9rem]">
        <h3 className="text-lg font-extrabold uppercase text-black sm:text-2xl">
          {item.name}
          {item.role ? `, ${item.role}` : ""}
        </h3>
      </div>

      {/* Quote */}
      <p className="mt-4 text-base leading-8 text-neutral-800 sm:text-lg">
        “{item.quote}”
      </p>
    </article>
  );
}

export default function Testimonials() {
  return (
    <section className="w-full bg-white px-6 py-20 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-8xl">
        <h2 className="text-center text-4xl font-extrabold uppercase text-red-600 sm:text-5xl">
          Our Testimonials!
        </h2>
        <p className="mt-6 text-center text-xl text-neutral-700 sm:text-2xl">
          What Our Clients Says
        </p>

        <div className="mt-16 grid gap-x-12 gap-y-6 md:grid-cols-2">
          {testimonials.map((t) => (
            <TestimonialCard key={t.name} item={t} />
          ))}
        </div>
      </div>
    </section>
  );
}