import { FaFacebook, FaInstagram, FaMapMarkerAlt, FaPhone, FaEnvelope, FaWhatsapp } from 'react-icons/fa';
import img1 from '../../assets/images/logo.jpeg';
import { Link } from 'react-router-dom';
import React from 'react';



type ContactItem =
	| {
			icon: React.ReactNode;
			type: 'email';
			text: string[];
	  }
	| {
			icon: React.ReactNode;
			type: 'map' | 'phone' | 'whatsapp';
			text: string;
			link: string;
	  };



const Footer = () => {
	const currentYear = new Date().getFullYear();

	const quickLinks = [
		{ name: 'Home', path: '/' },
		{ name: 'About Us', path: '/about' },
		{ name: 'Academics', path: '/academics' },
		{ name: 'Admissions', path: '/admissions' },
		{ name: 'Gallery', path: '/gallery' },
		{ name: 'Contact Us', path: '/contact' },
	];

	const contactInfo: ContactItem[] = [
	{
		icon: <FaMapMarkerAlt className="text-[#F5DEB3]" />,
		text: 'Gram Mindia, Indore Road, Ujjain – 456006, Madhya Pradesh, India',
		link: 'https://maps.google.com/?q=Gram+Mindia,+Indore+Road,+Ujjain+456006,+Madhya+Pradesh,+India',
		type: 'map',
	},
	{
		icon: <FaPhone className="text-[#F5DEB3]" />,
		text: 'Phone: 8989697401',
		link: 'tel:+918989697401',
		type: 'phone',
	},
	{
		icon: <FaWhatsapp className="text-[#F5DEB3]" />,
		text: 'Admission Queries: 8989697401',
		link: 'https://wa.me/918989697401',
		type: 'whatsapp',
	},
	{
		icon: <FaEnvelope className="text-[#F5DEB3]" />,
		text: [
			'principal@stanfordujjain.com',
			'admissions@stanfordujjain.com',
			'career@stanfordujjain.com',
		],
		type: 'email',
	},
];


	const socialLinks = [
		{
			icon: <FaInstagram />,
			url: 'https://instagram.com/stanford_ujjain',
			name: 'Instagram',
		},
		{
			icon: <FaFacebook />,
			url: 'https://facebook.com/stanfordujjain',
			name: 'Facebook',
		},
	];

	return (
		<footer className="bg-[#800000] text-[#FFF8DC] pt-8 sm:pt-12 pb-6 z-50">
			<div className="container mx-auto px-4 sm:px-6">
				{/* --- Main Grid --- */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
					{/* --- Logo & About --- */}
					<div className="sm:col-span-2 lg:col-span-1">
						<h3 className="text-xl sm:text-2xl font-bold mb-4 flex items-center gap-2 sm:gap-3">
							<img src={img1} alt="logo" className="h-20 w-32" />
							<span className="leading-tight">Stanford International school</span>
						</h3>

						<p className="text-[#FFF8DC]/90 mb-4 leading-relaxed text-sm sm:text-base">
							Founded in <span className="font-semibold">2006</span>, Stanford International school,
							Ujjain, is dedicated to shaping responsible, confident, and compassionate learners through
							holistic education.
						</p>

						{/* --- Social Links --- */}
						<div className="flex space-x-4 mt-4">
							{socialLinks.map((social, index) => (
								<a
									key={index}
									href={social.url}
									className="text-[#FFF8DC]/80 hover:text-[#F5DEB3] text-xl sm:text-2xl transition-colors"
									target="_blank"
									rel="noopener noreferrer"
									aria-label={social.name}
								>
									{social.icon}
								</a>
							))}
						</div>
					</div>

					{/* --- Quick Links --- */}
					<div>
						<h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 pb-2 border-b border-[#F5DEB3]/40">
							Quick Links
						</h3>
						<ul className="space-y-2">
							{quickLinks.map((link) => (
								<li key={link.name}>
									<Link
										to={link.path}
										className="text-[#FFF8DC]/80 hover:text-[#F5DEB3] transition-colors text-sm sm:text-base"
									>
										{link.name}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* --- Contact Info --- */}
					<ul className="space-y-3">
						{contactInfo.map((item, index) => (
							<li key={index} className="flex items-start">
								<span className="mt-1 mr-2 sm:mr-3 flex-shrink-0">{item.icon}</span>

								{item.type === 'email' ? (
    <span className="text-sm sm:text-base break-words">
										{item.text.map((email, idx) => (
											<div key={idx}>
												<a
													href={`mailto:${email}`}
                    className="text-[#FFF8DC]/90 hover:text-[#F5DEB3] transition-colors cursor-pointer"
													target="_blank"
													rel="noopener noreferrer"
												>
													{email}
												</a>
											</div>
										))}
									</span>
								) : (
									<a
										href={item.link}
										className="text-[#FFF8DC]/90 hover:text-[#F5DEB3] transition-colors text-sm sm:text-base break-words cursor-pointer"
										target="_blank"
										rel="noopener noreferrer"
									>
										{item.text}
									</a>
								)}
							</li>
						))}
					</ul>

					{/* --- Admission Enquiry --- */}
					<div>
						<h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 pb-2 border-[#F5DEB3]/40">
							Admission Enquiries
						</h3>
						<p className="text-[#FFF8DC]/90 mb-3 text-sm sm:text-base">
							Contact us for Admission related queries on –
						</p>
						<p className="text-[#FFF8DC]/90 mb-2 text-sm sm:text-base">
							📞 Call / WhatsApp:{' '}
							<a
								href="https://wa.me/918989697401"
								className="font-semibold text-[#F5DEB3] hover:text-[#FFE4B5] transition-colors cursor-pointer"
								target="_blank"
								rel="noopener noreferrer"
							>
								8989697401
							</a>
						</p>
						<p className="text-[#FFF8DC]/90 text-sm sm:text-base">
							✉️ Write to us:{' '}
							<a
								href="mailto:admissions@stanfordujjain.com"
								className="text-[#F5DEB3] underline hover:text-[#FFE4B5] break-words transition-colors"
							>
								admissions@stanfordujjain.com
							</a>
						</p>
					</div>
				</div>

				{/* --- Footer Bottom --- */}
				<div className="pt-6 mt-8 sm:mt-10 flex flex-col justify-center items-center">
					{/* Mobile/Tablet Layout */}
					<div className="flex flex-col gap-4 text-center lg:hidden">
						{/* Copyright */}
						<p className="text-[#FFF8DC]/70 text-xs sm:text-sm">
							&copy; {currentYear} Stanford International school, Ujjain. All Rights Reserved.
						</p>
					</div>

					{/* Desktop Layout */}
					<div className="hidden lg:flex justify-between items-center">
						<p className="text-[#FFF8DC]/70 text-sm">
							&copy; {currentYear} Stanford International school, Ujjain. All Rights Reserved.
						</p>
					</div>
					<div className="pb-4 text-center text-gray-400 mt-5">
						<p className="text-sm md:text-lg flex items-center justify-center">
							Built with ❤️ by{' '}
							<a
								href="https://elite8digital.in"
								target="_blank"
								rel="noopener noreferrer"
								className="text-blue-400 hover:text-blue-300 transition-colors inline-flex items-center ml-1"
							>
								Elite8 Digital
								<img
									src="/elite8digital-nav.png"
									alt="Elite8 Digital Logo"
									className="h-10 md:h-12 ml-2"
								/>
							</a>
						</p>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;