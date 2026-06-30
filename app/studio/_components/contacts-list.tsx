import { GroupedList, IconTile } from "@/components/ios";
import { Typography } from "@/components/nowts/typography";
import { Badge } from "@/components/ui/badge";
import type { ContactRecord } from "@/query/portfolio/get-contacts";

// UTC-pinned so server and client render the same string (no hydration drift).
const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  timeZone: "UTC",
  day: "numeric",
  month: "long",
  year: "numeric",
});

const SUBJECT_LABELS: Record<ContactRecord["subject"], string> = {
  QUESTIONS_SERVICES: "Questions / services",
  DEVIS: "Devis",
  AUTRE: "Autre",
};

export function ContactsList({ contacts }: { contacts: ContactRecord[] }) {
  if (contacts.length === 0) {
    return (
      <Typography variant="muted" className="text-ios-secondary-label">
        Aucun message de contact pour le moment.
      </Typography>
    );
  }

  return (
    <GroupedList>
      {contacts.map((contact) => (
        <div key={contact.id} className="flex flex-col gap-2 px-4 py-3">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="flex min-w-0 items-center gap-3">
              <IconTile name="mail" className="bg-blue-500" />
              <div className="flex min-w-0 flex-col">
                <Typography
                  as="span"
                  variant="default"
                  className="text-ios-label truncate font-medium"
                >
                  {contact.name}
                </Typography>
                <a
                  href={`mailto:${contact.email}`}
                  className="text-ios-secondary-label truncate text-sm hover:underline"
                >
                  {contact.email}
                </a>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {SUBJECT_LABELS[contact.subject]}
              </Badge>
              <Typography
                as="span"
                variant="tiny"
                className="text-ios-secondary-label"
              >
                {dateFormatter.format(contact.createdAt)}
              </Typography>
            </div>
          </div>
          <Typography
            variant="default"
            className="text-ios-label whitespace-pre-wrap"
          >
            {contact.message}
          </Typography>
        </div>
      ))}
    </GroupedList>
  );
}
