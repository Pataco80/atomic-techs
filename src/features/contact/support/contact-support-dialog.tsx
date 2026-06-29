"use client";

import { SectionTitle } from "@/components/shared/section-title";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ContactForm } from "@/features/contact/portfolio/contact-form";
import type { PropsWithChildren } from "react";
import { useState } from "react";

/**
 * Dialog de contact — réutilise le formulaire de contact du portfolio, présenté
 * comme la section contact du bas de page (titre + formulaire). Se ferme au
 * succès. Le déclencheur par défaut peut être remplacé via `children`.
 */
export const ContactSupportDialog = (props: PropsWithChildren) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {props.children ?? (
          <Button variant="outline" size="lg">
            Nous contacter
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogTitle className="sr-only">Contact</DialogTitle>
        <SectionTitle
          subtitle="contact"
          title="Prenez contact avec moi"
          titleVariant="h3"
          className="items-center text-center"
        />
        <div className="mt-6">
          <ContactForm onSuccess={() => setOpen(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
};
