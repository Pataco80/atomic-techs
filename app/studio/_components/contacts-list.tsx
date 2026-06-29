import { Typography } from "@/components/nowts/typography";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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
      <Typography variant="muted">
        Aucun message de contact pour le moment.
      </Typography>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {contacts.map((contact) => (
        <Card key={contact.id}>
          <CardContent className="flex flex-col gap-2">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="flex flex-col">
                <Typography as="span" variant="default" className="font-medium">
                  {contact.name}
                </Typography>
                <a
                  href={`mailto:${contact.email}`}
                  className="text-muted-foreground text-sm hover:underline"
                >
                  {contact.email}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  {SUBJECT_LABELS[contact.subject]}
                </Badge>
                <Typography
                  as="span"
                  variant="tiny"
                  className="text-muted-foreground"
                >
                  {dateFormatter.format(contact.createdAt)}
                </Typography>
              </div>
            </div>
            <Typography variant="default" className="whitespace-pre-wrap">
              {contact.message}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
