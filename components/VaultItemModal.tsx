import React, { useEffect, useMemo, useState } from "react";
import { X, Trash2, Save, Eye, EyeOff } from "lucide-react";
import { useTranslation } from "../services/i18n";
import type { VaultItem, VaultItemType } from "../types";

type EditableVaultItem = Partial<VaultItem>;

interface VaultItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: EditableVaultItem) => void;
  onDelete: () => void;
  initialData: EditableVaultItem | null;
}

const TYPE_OPTIONS: { value: VaultItemType; labelKey: string }[] = [
  { value: "login", labelKey: "vault.type.login" },
  { value: "card", labelKey: "vault.type.card" },
  { value: "note", labelKey: "vault.type.note" },
  { value: "identity", labelKey: "vault.type.identity" },
];

export const VaultItemModal: React.FC<VaultItemModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  initialData,
}) => {
  const { t } = useTranslation();
  const [form, setForm] = useState<EditableVaultItem>(initialData ?? {});
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setForm(initialData ?? {});
    setShowPassword(false);
  }, [initialData, isOpen]);

  const isNew = useMemo(() => !initialData?.id, [initialData]);

  if (!isOpen) return null;

  const type = (form.type as VaultItemType) || "login";

  const setField = (key: keyof EditableVaultItem, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const inputBase =
    "w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-white/40 outline-none focus:border-white/25";
  const labelBase = "text-xs text-white/70";
  const sectionTitle = "text-sm font-semibold text-white/90";

  const handleSave = () => {
    // mini guard: title obligatoire
    if (!String(form.title ?? "").trim()) {
      // si tu veux un toast plus tard, ici
      return;
    }
    onSave({
      ...form,
      type,
      title: String(form.title ?? "").trim(),
      username: form.username ? String(form.username).trim() : "",
      url: form.url ? String(form.url).trim() : "",
      notes: form.notes ? String(form.notes) : "",
      tags: Array.isArray(form.tags)
        ? form.tags
        : String(form.tags ?? "")
            .split(",")
            .map((x) => x.trim())
            .filter(Boolean),
      favorite: Boolean(form.favorite),
      category: form.category ? String(form.category).trim() : "",
      updatedAt: Date.now(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-gradient-to-b from-slate-900 to-black shadow-2xl">
        {/* header */}
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div>
            <div className="text-lg font-bold text-white">
              {isNew ? t("vault.modal.newTitle") : t("vault.modal.editTitle")}
            </div>
            <div className="text-xs text-white/60">
              {t("vault.modal.subtitle")}
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl border border-white/10 bg-white/5 p-2 text-white/80 hover:bg-white/10"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* body */}
        <div className="space-y-5 px-5 py-5">
          {/* Type + Favorite */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="md:col-span-2">
              <div className={labelBase}>{t("vault.fields.type")}</div>
              <select
                value={type}
                onChange={(e) => setField("type", e.target.value)}
                className={inputBase}
              >
                {TYPE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {t(opt.labelKey)}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end gap-2">
              <label className="flex w-full cursor-pointer items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white/90 hover:bg-white/10">
                <span className="text-sm">{t("vault.fields.favorite")}</span>
                <input
                  type="checkbox"
                  checked={Boolean(form.favorite)}
                  onChange={(e) => setField("favorite", e.target.checked)}
                />
              </label>
            </div>
          </div>

          {/* Title */}
          <div>
            <div className={labelBase}>{t("vault.fields.title")}</div>
            <input
              className={inputBase}
              placeholder={t("vault.placeholders.title")}
              value={String(form.title ?? "")}
              onChange={(e) => setField("title", e.target.value)}
            />
          </div>

          {/* Category + tags */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <div className={labelBase}>{t("vault.fields.category")}</div>
              <input
                className={inputBase}
                placeholder={t("vault.placeholders.category")}
                value={String(form.category ?? "")}
                onChange={(e) => setField("category", e.target.value)}
              />
            </div>
            <div>
              <div className={labelBase}>{t("vault.fields.tags")}</div>
              <input
                className={inputBase}
                placeholder={t("vault.placeholders.tags")}
                value={
                  Array.isArray(form.tags)
                    ? form.tags.join(", ")
                    : String(form.tags ?? "")
                }
                onChange={(e) => setField("tags", e.target.value)}
              />
            </div>
          </div>

          {/* Type-specific fields */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className={sectionTitle}>{t("vault.modal.details")}</div>

            {type === "login" && (
              <div className="mt-3 space-y-3">
                <div>
                  <div className={labelBase}>{t("vault.fields.username")}</div>
                  <input
                    className={inputBase}
                    placeholder={t("vault.placeholders.username")}
                    value={String(form.username ?? "")}
                    onChange={(e) => setField("username", e.target.value)}
                  />
                </div>

                <div>
                  <div className={labelBase}>{t("vault.fields.password")}</div>
                  <div className="flex gap-2">
                    <input
                      className={inputBase}
                      type={showPassword ? "text" : "password"}
                      placeholder={t("vault.placeholders.password")}
                      value={String(form.password ?? "")}
                      onChange={(e) => setField("password", e.target.value)}
                    />
                    <button
                      onClick={() => setShowPassword((s) => !s)}
                      className="shrink-0 rounded-xl border border-white/10 bg-white/5 px-3 text-white/80 hover:bg-white/10"
                      aria-label="Toggle password"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div>
                  <div className={labelBase}>{t("vault.fields.url")}</div>
                  <input
                    className={inputBase}
                    placeholder="https://..."
                    value={String(form.url ?? "")}
                    onChange={(e) => setField("url", e.target.value)}
                  />
                </div>
              </div>
            )}

            {type === "note" && (
              <div className="mt-3">
                <div className={labelBase}>{t("vault.fields.notes")}</div>
                <textarea
                  className={`${inputBase} min-h-[120px]`}
                  placeholder={t("vault.placeholders.notes")}
                  value={String(form.notes ?? "")}
                  onChange={(e) => setField("notes", e.target.value)}
                />
              </div>
            )}

            {/* modes "card" / "identity" : on garde simple pour pas tout péter */}
            {(type === "card" || type === "identity") && (
              <div className="mt-3 space-y-3">
                <div>
                  <div className={labelBase}>{t("vault.fields.notes")}</div>
                  <textarea
                    className={`${inputBase} min-h-[120px]`}
                    placeholder={t("vault.placeholders.notes")}
                    value={String(form.notes ?? "")}
                    onChange={(e) => setField("notes", e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Notes global (si besoin) */}
          {type !== "note" && (
            <div>
              <div className={labelBase}>{t("vault.fields.notes")}</div>
              <textarea
                className={`${inputBase} min-h-[110px]`}
                placeholder={t("vault.placeholders.notes")}
                value={String(form.notes ?? "")}
                onChange={(e) => setField("notes", e.target.value)}
              />
            </div>
          )}
        </div>

        {/* footer */}
        <div className="flex flex-col-reverse gap-2 border-t border-white/10 px-5 py-4 md:flex-row md:items-center md:justify-between">
          <button
            onClick={onDelete}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-red-200 hover:bg-red-500/15"
          >
            <Trash2 size={16} />
            {t("vault.actions.delete")}
          </button>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white/80 hover:bg-white/10"
            >
              {t("common.cancel")}
            </button>

            <button
              onClick={handleSave}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 font-semibold text-black hover:opacity-90"
            >
              <Save size={16} />
              {t("common.save")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
