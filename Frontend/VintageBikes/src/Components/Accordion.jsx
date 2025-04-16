import { Accordion } from "flowbite-react";

export default function MyAccordion() {
	return (
		<div className="max-w-xl mx-auto mt-10">
			<Accordion>
				<Accordion.Panel>
					<Accordion.Title>What is Flowbite?</Accordion.Title>
					<Accordion.Content>
						<p className="mb-2 text-gray-500 dark:text-gray-400">
							Flowbite is an open-source library of UI components built with
							Tailwind CSS.
						</p>
					</Accordion.Content>
				</Accordion.Panel>
				<Accordion.Panel>
					<Accordion.Title>Is it free to use?</Accordion.Title>
					<Accordion.Content>
						<p className="mb-2 text-gray-500 dark:text-gray-400">
							Yes, Flowbite offers free components as well as premium ones for
							advanced features.
						</p>
					</Accordion.Content>
				</Accordion.Panel>
				<Accordion.Panel>
					<Accordion.Title>How do I get started?</Accordion.Title>
					<Accordion.Content>
						<p className="mb-2 text-gray-500 dark:text-gray-400">
							Install the package, configure Tailwind, and start importing
							components in your React app!
						</p>
					</Accordion.Content>
				</Accordion.Panel>
			</Accordion>
		</div>
	);
}
