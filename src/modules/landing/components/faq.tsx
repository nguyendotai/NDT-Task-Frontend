"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/components/ui/accordion";

const FAQS = [
  {
    question: "NDT Task có miễn phí sử dụng không?",
    answer:
      "Có. Gói Free cho phép bạn tạo Workspace, mời tối đa 5 thành viên và dùng đầy đủ Kanban Board.",
  },
  {
    question: "Tôi có thể dùng cả Kanban và Scrum không?",
    answer:
      "Có. Mỗi Workspace bạn tạo có thể chọn loại Kanban hoặc Scrum tuỳ theo quy trình làm việc của team.",
  },
  {
    question: "Dữ liệu của tôi có được bảo mật không?",
    answer:
      "Có. Mỗi Workspace được cách ly dữ liệu hoàn toàn, phân quyền theo vai trò Owner/Admin/Member ở tầng Backend.",
  },
  {
    question: "NDT Task có hỗ trợ cập nhật thời gian thực không?",
    answer:
      "Có. Thay đổi trên Task/Board/Comment được đồng bộ realtime tới mọi thành viên đang xem cùng Board.",
  },
  {
    question: "Tôi có thể nâng cấp hoặc huỷ gói bất cứ lúc nào không?",
    answer: "Có, bạn có thể nâng cấp/huỷ gói bất kỳ lúc nào, không ràng buộc hợp đồng dài hạn.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="text-center">
        <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
          Frequently asked questions
        </h2>
      </div>

      <Accordion className="mt-10" defaultValue={[]}>
        {FAQS.map((faq) => (
          <AccordionItem key={faq.question} value={faq.question}>
            <AccordionTrigger>{faq.question}</AccordionTrigger>
            <AccordionContent>
              <p className="text-muted-foreground">{faq.answer}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
